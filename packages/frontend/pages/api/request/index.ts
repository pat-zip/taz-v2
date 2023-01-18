import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { APP_ADDRESS, PRIVATE_KEY, ETH_PROVIDER_URL } from "../../../../../config.js";
import UnirepApp from "@taz-v2/contracts/artifacts/contracts/UnirepApp.sol/UnirepApp.json";
import { UserState, schema } from "@unirep/core";
import { defaultProver as prover } from "@unirep/circuits/provers/defaultProver";
import { ZkIdentity, Strategy, hash1, stringifyBigInts } from "@unirep/utils";
import { DB, SQLiteConnector } from "anondb/node";

const contractAddress = APP_ADDRESS;
const abi = UnirepApp.abi;
const provider = new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY);
const signer = wallet.connect(provider);
const contract = new ethers.Contract(contractAddress, abi, signer);

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    async function genUserState(id, app) {
        // generate a user state
        const db = await SQLiteConnector.create(schema, ":memory:");
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
        await userState.start();
        await userState.waitForSync();
        return userState;
    }

    if (_req.method === "POST") {
        try {
            const id = new ZkIdentity();
            const userState = await genUserState(id, contract);
            const epochKeyProof = await userState.genEpochKeyProof({ nonce: 0 });
            const graffiti = hash1([`0x${Buffer.from("abc".toString()).toString("hex")}`]);
            const epoch = await contract.attesterCurrentEpoch();

            // const { publicSignals, proof } = await userState.genUserSignUpProof();
            // console.log("publicSignals: ", publicSignals);

            const tx = await contract.submitAttestation(epoch, epochKeyProof.epochKey, 10, 1, graffiti);
            await tx.wait();
            const hash = tx.hash;
            res.status(200).json({ hash });
        } catch (err: any) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    } else {
        res.status(400).json({ error: "Method must be POST" });
    }
};

export default handler;
