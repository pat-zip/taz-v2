import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
const snarkjs = require("snarkjs");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { circuitName, publicSignals, proof } = req.body;
      const directory = path.join(process.cwd(), "keys");
      const verificationKeyJsonPath = directory + `/${circuitName}_verification_key.json`;
      let result = { isVerified: false, message: "" };
      try {
        const vKey = JSON.parse(fs.readFileSync(verificationKeyJsonPath).toString());
        const verificationResult = await snarkjs.groth16.verify(vKey, publicSignals, proof);
        if (verificationResult === true) {
          result.isVerified = true;
          result.message = "Verification OK";
        } else {
          result.isVerified = false;
          result.message = "Invalid proof";
        }
        res.status(200).json(result);
      } catch (err: any) {
        result.isVerified = false;
        result.message = err.message;
        res.status(500).json(result);
        return;
      }
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).json({ error: "Method must be POST" });
  }
};

export default handler;
