import { NextApiRequest, NextApiResponse } from "next";

import { SignupProof } from "@unirep/contracts";
import { ethers } from "ethers";
// import { APP_ADDRESS } from '../config.mjs'
// import TransactionManager from '../singletons/TransactionManager.mjs'
// import { createRequire } from 'module'
import UnirepApp from "@taz-v2/contracts/artifacts/contracts/UnirepApp.sol/UnirepApp.json";
import { UserState, schema } from "@unirep/core";
import { defaultProver as prover } from "@unirep/circuits/provers/defaultProver";
import { ZkIdentity } from "@unirep/utils";
import { DB, SQLiteConnector } from "anondb/node";

// const require = createRequire(import.meta.url)
// const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const contractAddress = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";
// const abi = require("@taz-v2/contracts/artifacts/contracts/Lock.sol/Lock.json").abi;
const abi =
  require("@taz-v2/contracts/artifacts/contracts/UnirepApp.sol/UnirepApp.json").abi;
const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet(privateKey);
const signer = wallet.connect(provider);
const contract = new ethers.Contract(contractAddress, abi, signer);

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  async function genUserState(id, app) {
    // generate a user state
    const db = await SQLiteConnector.create(schema, ":memory:");
    // console.log("app: ", app);
    console.log("await app.unirep(): ", await app.unirep());
    console.log("app.address: ", app.address);
    console.log("BigInt(app.address): ", BigInt(app.address));

    const unirepAddress = await app.unirep();
    const attesterId = BigInt(app.address);
    const userState = new UserState({
      db,
      prover,
      unirepAddress,
      provider: provider,
      attesterId,
      _id: id,
    });
    // console.log("userState: ", userState);
    await userState.start();
    await userState.waitForSync();
    return userState;
  }

  //   try {
  const id = new ZkIdentity();
  const userState = await genUserState(id, contract);

  const { publicSignals, proof } = await userState.genUserSignUpProof();
  console.log("publicSignals: ", publicSignals);
  const tx = await contract.userSignUp(publicSignals, proof);
  await tx.wait();
  const hash = tx.hash;
  console.log("hash: ", hash);
  res.status(200).json({ hash });
  //   } catch (err: any) {
  //     res.status(500).json({ statusCode: 500, message: err.message });
  //   }
};

export default handler;
