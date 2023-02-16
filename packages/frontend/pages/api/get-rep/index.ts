import { NextApiRequest, NextApiResponse } from "next";
const snarkjs = require("snarkjs");
import path from "path";
import { APP_ADDRESS, UNIREP_ADDRESS, IDENTITY, ETH_PROVIDER_URL, PRIVATE_KEY } from "../../../../config.js";
import { ethers } from "ethers";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { stats } = req.body;
    console.log("stats: ", stats);
    let posRep = 0;
    let negRep = 0;
    const registers = Object.values(stats);
    console.log("registers.length", registers.length);
    for (let i = 0; i < registers.length; i++) {
      console.log("registers[i]: ", registers[i]);
      posRep += registers[i] * 2 ** ((registers.length - 1 - i) * 8);
    }
    res.status(200).json({ posRep: posRep, negRep });
  }
};

export default handler;
