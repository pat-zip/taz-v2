import React, { useState, useRef, useEffect } from "react";
const { ethers } = require("hardhat");
const { ZkIdentity } = require("@unirep/utils");
const { SQLiteConnector } = require("anondb/node");
const { schema } = require("@unirep/core");
import AppUserState from "../../lib/AppUserState";

interface Props {
  stat: { name: string; color: string; registerIndex: number; bits: number };
  minValue: number;
}

const { defaultProver: prover } = require("@unirep/circuits/provers/defaultProver");

const ProveStat: React.FC<Props> = ({ stat, minValue }) => {

    const genUserState = async (id, app) {
        // generate a user state
        const db = await SQLiteConnector.create(schema, ":memory:");
        const unirepAddress = await app.unirep();
        const attesterId = BigInt(app.address);
        const userState = new AppUserState({
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
    
    const handleProveStat = async (): Promise<string | null> => { 
        
       // need to implement using function above

      };

  return (
    <div className="flex flex-col justify-center items-center h-32">
      <button className="w-36 h-10 bg-neutral-500 text-white rounded-full py-2 px-4" onClick={handleProveStat}>Prove Stat</button>
      <div className="text-gray-400 text-sm mt-2">Min Value Provided: {minValue}</div>
    </div>
  );
};

export default ProveStat;
