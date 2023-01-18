import Link from "next/link";
import Layout from "../../components/Layout";
import { ZkIdentity, Strategy, hash1, stringifyBigInts } from "@unirep/utils";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { APP_ADDRESS, PRIVATE_KEY, SERVER, UNIREP_ADDRESS } from "../../../../config";
import UnirepApp from "@taz-v2/contracts/artifacts/contracts/UnirepApp.sol/UnirepApp.json";
import { MemoryConnector } from "anondb/web";
import { constructSchema } from "anondb/types";
import { UserState, schema } from "@unirep/core";

const provider = new ethers.providers.JsonRpcProvider();
const wallet = new ethers.Wallet(PRIVATE_KEY);
const signer = wallet.connect(provider);
const contract = new ethers.Contract(APP_ADDRESS, UnirepApp.abi, signer);

const UnirepPage = () => {
    // const prover = {
    //     verifyProof: async (circuitName, publicSignals, proof) => {
    //         const snarkjs = await import(/* webpackPrefetch: true */ "snarkjs");
    //         const url = new URL(`/build/${circuitName}.vkey.json`, SERVER);
    //         const vkey = await fetch(url.toString()).then((r) => r.json());
    //         return snarkjs.groth16.verify(vkey, publicSignals, proof);
    //     },
    //     genProofAndPublicSignals: async (circuitName, inputs) => {
    //         const snarkjs = await import(/* webpackPrefetch: true */ "snarkjs");
    //         const wasmUrl = new URL(`/build/${circuitName}.wasm`, SERVER);
    //         const wasm = await fetch(wasmUrl.toString()).then((r) => r.arrayBuffer());
    //         const zkeyUrl = new URL(`/build/${circuitName}.zkey`, SERVER);
    //         const zkey = await fetch(zkeyUrl.toString()).then((r) => r.arrayBuffer());
    //         const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    //             inputs,
    //             new Uint8Array(wasm),
    //             new Uint8Array(zkey)
    //         );
    //         return { proof, publicSignals };
    //     },
    // };

    // useEffect(() => {
    //     async () => {
    //         const id = localStorage.getItem("id");
    //         const identity = new ZkIdentity(id ? Strategy.SERIALIZED : Strategy.RANDOM, id);
    //         if (!id) {
    //             localStorage.setItem("id", identity.serializeIdentity());
    //         }

    //         const db = new MemoryConnector(constructSchema(schema));
    //         const userState = new UserState({
    //             db,
    //             provider,
    //             prover,
    //             unirepAddress: UNIREP_ADDRESS,
    //             attesterId: APP_ADDRESS,
    //             _id: identity,
    //         });
    //         await userState.start();
    //         await userState.waitForSync();
    //     };
    // }, []);

    async function handleAttesterCurrentEpoch() {
        const epoch = await contract.attesterCurrentEpoch();
        alert("Epoch: " + epoch);
    }

    async function handleAttesterEpochRemainingTime() {
        const remainingTime = await contract.attesterEpochRemainingTime();
        alert("Remaining time: " + remainingTime);
    }

    // async function genUserState(id, app) {
    //     // generate a user state
    //     const db = await SQLiteConnector.create(schema, ":memory:");
    //     const unirepAddress = await app.unirep();
    //     const attesterId = BigInt(app.address);
    //     const userState = new UserState({
    //         db,
    //         prover,
    //         unirepAddress,
    //         provider: provider,
    //         attesterId,
    //         _id: id,
    //     });
    //     await userState.start();
    //     await userState.waitForSync();
    //     return userState;
    // }

    async function handleSubmitAttestation() {
        // const epochKeyProof = await this.userState.genEpochKeyProof({ nonce: epkNonce });
        // const graffiti = hash1([`0x${Buffer.from(graffitiPreImage.toString()).toString("hex")}`]);
        const data = await fetch(`${SERVER}/api/request`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                // stringifyBigInts({
                //     posRep,
                //     negRep,
                //     graffiti,
                //     publicSignals: epochKeyProof.publicSignals,
                //     proof: epochKeyProof.proof,
                // })
            }),
        }).then((r) => r.json());
        // await provider.waitForTransaction(data.hash);
        // await this.userState.waitForSync();
        // await this.loadReputation();
        alert("Attestation result: " + JSON.stringify(data));
    }

    async function handleSignUp() {
        // const id = new ZkIdentity();
        // const userState = await genUserState(id, contract);

        // const { publicSignals, proof } = await userState.genUserSignUpProof();
        // const tx = await contract.userSignUp(publicSignals, proof);
        // await tx.wait();

        const data = await fetch(`${SERVER}/api/signup`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                // publicSignals: signupProof.publicSignals,
                // proof: signupProof.proof,
            }),
        }).then((r) => r.json());
        // await provider.waitForTransaction(data.hash);
        // await this.userState.waitForSync();
        // this.hasSignedUp = await this.userState.hasSignedUp()
        // this.latestTransitionedEpoch = this.userState.calcCurrentEpoch()

        alert("Sign up successful!: " + JSON.stringify(data));
    }

    // async function genUserState(id, app) {
    //   // generate a user state
    //   const db = null; //await SQLiteConnector.create(schema, ":memory:");
    //   const unirepAddress = await app.unirep();
    //   const attesterId = BigInt(app.address);
    //   const userState = new UserState({
    //     db,
    //     prover,
    //     unirepAddress,
    //     provider: provider,
    //     attesterId,
    //     _id: id,
    //   });
    //   // await userState.start();
    //   // await userState.waitForSync();
    //   return userState;
    // }

    return (
        <Layout title="Simple Unirep Functionality">
            <section className="bg-gray-100 py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-medium text-center mb-4">Unirep</h1>
                    <p className="text-center text-gray-700 mb-8">Basic functions of Unirep</p>
                </div>
            </section>

            <section className="bg-white py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-medium text-center mb-4">Get Current Epoch</h1>
                    <div className="text-center">
                        <button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg`}
                            onClick={handleAttesterCurrentEpoch}
                        >
                            Get Current Epoch
                        </button>
                    </div>
                </div>
            </section>

            <section className="bg-white py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-medium text-center mb-4">Get Epoch Remaining Time</h1>
                    <div className="text-center">
                        <button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg`}
                            onClick={handleAttesterEpochRemainingTime}
                        >
                            Get Remaining Time
                        </button>
                    </div>
                </div>
            </section>

            <section className="bg-white py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-medium text-center mb-4">Sign Up</h1>
                    <div className="text-center">
                        <button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg`}
                            onClick={handleSignUp}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </section>

            <section className="bg-white py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-medium text-center mb-4">Submit Attestation</h1>
                    <div className="text-center">
                        <button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg`}
                            onClick={handleSubmitAttestation}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </section>

            {/* <section className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-700 mb-8">
            <Link href="/">Go home</Link>
          </p>
        </div>
      </section> */}
        </Layout>
    );
};
//   const [withdrawButtonDisabled, setWithdrawButtonDisabled] = useState(true);

//   useEffect(() => {
//     async function checkUnlockTime() {
//       const unlockTime = await contract.unlockTime();
//       const currentTime = await provider.getBlockNumber();
//       if (currentTime >= unlockTime) {
//         setWithdrawButtonDisabled(false);
//       } else {
//         setWithdrawButtonDisabled(true);
//       }
//     }
//     checkUnlockTime();
//   }, []);

//   async function handleWithdraw() {
//     await contract.withdraw();
//     alert("Withdrawal successful!");
//   }

//   return (
//     <Layout title="Simple Unirep Functionality">
//       <h1>Unirep</h1>
//       <p>This is the Unirep page</p>

//       <div className="bg-gray-200 p-5">
//         <h1 className="text-2xl font-medium text-center mb-5">
//           Withdraw from Lock Contract
//         </h1>
//         <button
//           className={`bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg ${
//             withdrawButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           onClick={handleWithdraw}
//           disabled={withdrawButtonDisabled}
//         >
//           Withdraw
//         </button>
//       </div>

//       <p>
//         <Link href="/">Go home</Link>
//       </p>
//     </Layout>
//   );
// };
export default UnirepPage;
