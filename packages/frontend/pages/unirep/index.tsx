import Link from "next/link";
import Layout from "../../components/Layout";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ZkIdentity } from "@unirep/utils";
import { UserState } from "@unirep/core";
import { defaultProver as prover } from "@unirep/circuits/provers/defaultProver";

// const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const contractAddress = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";
// const abi = require("@taz-v2/contracts/artifacts/contracts/Lock.sol/Lock.json").abi;
const abi =
  require("@taz-v2/contracts/artifacts/contracts/UnirepApp.sol/UnirepApp.json").abi;
const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const provider = new ethers.providers.JsonRpcProvider();
const wallet = new ethers.Wallet(privateKey);
const signer = wallet.connect(provider);
const contract = new ethers.Contract(contractAddress, abi, signer);
const SERVER = "http://127.0.0.1:3000";

const UnirepPage = () => {
  async function handleSubmitAttestation() {
    const data = await fetch(`${SERVER}/api/request`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // publicSignals: signupProof.publicSignals,
        // proof: signupProof.proof,
      }),
    }).then((r) => r.json());
    await provider.waitForTransaction(data.hash);
  }

  async function handleSignUp() {
    // const id = new ZkIdentity();
    // const userState = await genUserState(id, contract);

    // const { publicSignals, proof } = await userState.genUserSignUpProof();
    // const tx = await contract.userSignUp(publicSignals, proof);
    // await tx.wait();

    const data = await fetch(`${SERVER}/api/signup`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // publicSignals: signupProof.publicSignals,
        // proof: signupProof.proof,
      }),
    }).then((r) => r.json());
    await provider.waitForTransaction(data.hash);
    // await this.userState.waitForSync();
    // this.hasSignedUp = await this.userState.hasSignedUp()
    // this.latestTransitionedEpoch = this.userState.calcCurrentEpoch()

    alert("Sign up successful!");
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
          <p className="text-center text-gray-700 mb-8">
            Basic functions of Unirep
          </p>
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
          <h1 className="text-3xl font-medium text-center mb-4">
            Submit Attestation
          </h1>
          <div className="text-center">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg`}
              onClick={handleSignUp}
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
