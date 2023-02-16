import React, { useState, useRef, useEffect } from "react";
import { ZkIdentity, Strategy, hash1 } from "@unirep/utils";
import { MemoryConnector } from "anondb/web";
import { constructSchema } from "anondb/types";
import { schema } from "@unirep/core";
import AppUserState from "../../lib/AppUserState";
import prover from "../../lib/prover";
import { APP_ADDRESS, UNIREP_ADDRESS, IDENTITY, ETH_PROVIDER_URL, PRIVATE_KEY } from "../../../../config.js";
import { ethers } from "ethers";

interface Props {
  stat: { name: string; color: string; registerIndex: number; bits: number };
  minValue: number;
}

const Flow: React.FC<Props> = ({ stat, minValue }) => {
  const [signUpButtonText, setSignUpButtonText] = useState("Sign Up");
  const [identityText, setIdentityText] = useState("");
  const [identity, setIdentity] = useState(null);
  const [testUnirepText, setTestUnirepText] = useState("");
  const [isSubmittingAttestation, setIsSubmittingAttestation] = useState(false);

  const unirepAppAbi = require("../../abis/UnirepApp.json").abi;
  const unirepAbi = require("@unirep/contracts/abi/Unirep.json");
  const provider = new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const app = new ethers.Contract(APP_ADDRESS, unirepAppAbi, wallet);
  const unirep = new ethers.Contract(UNIREP_ADDRESS, unirepAbi, provider);
  // console.log("unirepAppAbi", unirepAppAbi);
  // console.log("unirepAbi", unirepAbi);

  // Get identity from local storage
  const createIdentity = () => {
    const id = localStorage.getItem("id");
    const temp_id = new ZkIdentity(id ? Strategy.SERIALIZED : Strategy.RANDOM, id);
    setIdentity(temp_id);
    if (!id) {
      localStorage.setItem("id", temp_id.serializeIdentity());
    }
  };

  const genAppUserState = async () => {
    const db = new MemoryConnector(constructSchema(schema));
    const userState = new AppUserState({
      db,
      prover,
      unirepAddress: UNIREP_ADDRESS,
      provider: new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL),
      attesterId: APP_ADDRESS,
      _id: identity,
    });
    await userState.start();
    await userState.waitForSync();
    return userState;
  };

  const checkSignUp = async () => {
    // debugger;
    const appUserState = await genAppUserState();
    const hasSignedUp = await appUserState.hasSignedUp();
    console.log("User has signed up?: ", hasSignedUp);
    if (hasSignedUp) setSignUpButtonText("User Signed Up");
    else setSignUpButtonText("Sign Up");
  };

  useEffect(() => {
    createIdentity();
  }, []);

  useEffect(() => {
    if (identity !== null) {
      setIdentityText(identity?.identityNullifier.toString());
      checkSignUp();
    }
  }, [identity]);

  const resetIdentity = () => {
    localStorage.removeItem("id");
    createIdentity();
  };

  const handleTestUnirep = async () => {
    const result1 = await unirep.attesterStartTimestamp(app.address);
    const result2 = await unirep.attesterCurrentEpoch(app.address);
    setTestUnirepText("Attester Start Timestamp: " + result1 + " | Attester Current Epoch: " + result2);
  };

  const handleSignUp = async () => {
    const appUserState = await genAppUserState();
    const { publicSignals, proof } = await appUserState.genUserSignUpProof();
    console.log("user sign up publicSignals: ", publicSignals);
    await app.userSignUp(publicSignals, proof).then((t) => t.wait());
    checkSignUp();
  };

  const handleSubmitAttestation = async () => {
    setIsSubmittingAttestation(true);
    debugger;

    // Create the user state
    const appUserState = await genAppUserState();

    // Check if user has signed up
    const hasSignedUp = await appUserState.hasSignedUp();
    console.log("User has signed up?: ", hasSignedUp);
    if (!hasSignedUp) {
      console.log("User not signed up");
      return;
    }

    const nonce = 0;
    const { publicSignals, proof, epochKey, epoch } = await appUserState.genEpochKeyProof({ nonce });
    await unirep.verifyEpochKeyProof(publicSignals, proof).then((t) => t.wait());

    const posRep = 2;
    const negRep = 0;
    const graffiti = hash1([`0x${Buffer.from("abc").toString("hex")}`]);
    await app.submitAttestation(epoch, epochKey, posRep, negRep, graffiti).then((t) => t.wait());

    setIsSubmittingAttestation(false);
  };

  const handleProveStat = async () => {
    const unirepAppAbi = require("../../abis/UnirepApp.json").abi;
    const provider = new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const app = new ethers.Contract(APP_ADDRESS, unirepAppAbi, wallet);

    // Create the user state
    const appUserState = await genAppUserState();

    // Check if user has signed up
    const hasSignedUp = await appUserState.hasSignedUp();
    console.log("User has signed up?: ", hasSignedUp);
    if (!hasSignedUp) {
      const { publicSignals, proof } = await appUserState.genUserSignUpProof();
      console.log("user sign up publicSignals: ", publicSignals);
      await app.userSignUp(publicSignals, proof).then((t) => t.wait());
    }

    // Generate the proof
    const { publicSignals, proof } = await appUserState.genProveRepRegisterProof(
      {
        epkNonce: 0,
        minRep: 4,
        graffitiPreImage: "abc",
      }
      // {
      //     minValue,
      //     registerIndex: stat.registerIndex,
      //     byteLength: stat.bits / 8,
      //   }
    );
    console.log("reputation register proof publicSignals: ", publicSignals);
    // Verify that the proof is valid

    try {
      await app.verifyRepRegisterProof(publicSignals, proof).then((t) => t.wait());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      <div className="flex flex-col justify-center items-center h-32">
        <button className="w-60 h-10 bg-neutral-500 text-white rounded-full py-2 px-4" onClick={handleTestUnirep}>
          Ping Unirep Contract
        </button>
        <div className="text-gray-400 text-sm mt-2 text-center w-1/2 overflow-hidden">{testUnirepText}</div>
      </div>
      <div className="flex flex-col justify-center items-center h-32">
        <button className="w-40 h-10 bg-neutral-500 text-white rounded-full py-2 px-4" onClick={handleSignUp}>
          {signUpButtonText}
        </button>
        <div className="text-gray-400 text-sm mt-2 text-center w-1/2 overflow-hidden">
          Identity: <span className="truncate">{identityText}</span>...{" "}
          <button className="border-neutral-500 border-2 rounded-md px-1" onClick={resetIdentity}>
            Reset
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center h-32">
        <button
          className="h-10 w-48 bg-neutral-500 text-white rounded-full py-2 px-4 mx-auto"
          onClick={handleSubmitAttestation}
        >
          Submit Rep
          {isSubmittingAttestation ? <div className="w-4 h-4 border-4 rounded-md animate-spin m-auto" /> : ""}
        </button>
        <div className="text-gray-400 text-sm mt-2">Add Pos Rep: 2</div>
      </div>
      <div className="flex flex-col justify-center items-center h-32">
        <button className="w-36 h-10 bg-neutral-500 text-white rounded-full py-2 px-4" onClick={handleProveStat}>
          Prove Stat
        </button>
        <div className="text-gray-400 text-sm mt-2">Min Value Provided: {minValue}</div>
      </div>
    </div>
  );
};

export default Flow;
