const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployUnirep } = require("@unirep/contracts/deploy");
const { genRandomSalt, hashOne, ZkIdentity } = require("@unirep/utils");
const { schema, UserState } = require("@unirep/core");
const { DB, SQLiteConnector } = require("anondb/node");
const { Unirep } = require("@unirep/contracts");

const { defaultProver: prover } = require("@unirep/circuits/provers/defaultProver");

async function genUserState(id, app) {
  // generate a user state
  const db = await SQLiteConnector.create(schema, ":memory:");
  const unirepAddress = await app.unirep();
  const attesterId = BigInt(app.address);
  const userState = new UserState({
    db,
    prover,
    unirepAddress,
    provider: ethers.provider,
    attesterId,
    _id: id,
  });
  await userState.start();
  await userState.waitForSync();
  return userState;
}

describe("Unirep App", function () {
  let unirep;
  let app;
  let verifier;

  // epoch length
  const epochLength = 30;
  let startTime = 0;
  // generate random user id
  const id = new ZkIdentity();
  // graffiti preimage
  const graffitiPreImage = genRandomSalt();

  it("deployment", async function () {
    const [deployer] = await ethers.getSigners();
    unirep = await deployUnirep(deployer);

    const Verifier = await ethers.getContractFactory("ProveRepRegisterVerifier");
    verifier = await Verifier.deploy();
    await verifier.deployed();

    const App = await ethers.getContractFactory("UnirepApp");
    app = await App.deploy(unirep.address, "0xb794f5ea0ba39494ce839613fffba74279579268", epochLength);
    await app.deployed();

    startTime = (await unirep.attesterStartTimestamp(app.address)).toNumber();
  });

  it("user sign up", async () => {
    const userState = await genUserState(id, app);

    // generate
    const { publicSignals, proof } = await userState.genUserSignUpProof();
    console.log("user sign up publicSignals: ", publicSignals);
    await app.userSignUp(publicSignals, proof).then((t) => t.wait());
  });

  it("submit attestations", async () => {
    const userState = await genUserState(id, app);

    const nonce = 0;
    const { publicSignals, proof, epochKey, epoch } = await userState.genEpochKeyProof({ nonce });
    await unirep.verifyEpochKeyProof(publicSignals, proof).then((t) => t.wait());

    const posRep = 5;
    const negRep = 0;
    const graffiti = hashOne(graffitiPreImage);
    await app.submitAttestation(epoch, epochKey, posRep, negRep, graffiti).then((t) => t.wait());
  });

  it("(attester/relayer) process attestations", async () => {
    const userState = await genUserState(id, app);
    const epoch = await userState.loadCurrentEpoch();
    await unirep.buildHashchain(app.address, epoch).then((t) => t.wait());
    const index = await unirep.attesterHashchainProcessedCount(app.address, epoch);
    const hashchain = await unirep.attesterHashchain(app.address, epoch, index);
    const { publicSignals, proof } = await userState.genAggregateEpochKeysProof({
      epochKeys: hashchain.epochKeys,
      newBalances: hashchain.epochKeyBalances,
      hashchainIndex: hashchain.index,
      epoch,
    });
    await unirep.processHashchain(publicSignals, proof).then((t) => t.wait());
  });

  it("user state transition", async () => {
    const oldEpoch = await unirep.attesterCurrentEpoch(app.address);
    const timestamp = Math.floor(+new Date() / 1000);
    const waitTime = startTime + epochLength - timestamp;
    for (;;) {
      await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
      await ethers.provider.send("evm_mine", []);
      const newEpoch = await unirep.attesterCurrentEpoch(app.address);
      if (oldEpoch.toNumber() + 1 == newEpoch.toNumber()) break;
    }
    const newEpoch = await unirep.attesterCurrentEpoch(app.address);
    const userState = await genUserState(id, app);
    const { publicSignals, proof } = await userState.genUserStateTransitionProof({ toEpoch: newEpoch.toNumber() });
    await unirep.userStateTransition(publicSignals, proof).then((t) => t.wait());
  });

  it("reputation proof", async () => {
    const userState = await genUserState(id, app);

    const { publicSignals, proof } = await userState.genProveReputationProof({
      epkNonce: 0,
      minRep: 4,
      graffitiPreImage,
    });
    console.log("reputation proof publicSignals: ", publicSignals);
    await unirep.verifyReputationProof(publicSignals, proof).then((t) => t.wait());
  });

  it("stat proof", async () => {
    // Implementing inherited version of userState (appUserState) in order to use custom getProveReputationProof
    // const userState = await genUserState(id, app);
    // const { publicSignals, proof } = await userState.genProveReputationProof({
    //   epkNonce: 0,
    //   minRep: 4,
    //   graffitiPreImage,
    // });
    // console.log("reputation register proof publicSignals: ", publicSignals);
    // await app.verifyRepRegisterProof(publicSignals, proof).then((t) => t.wait());
  });
});
