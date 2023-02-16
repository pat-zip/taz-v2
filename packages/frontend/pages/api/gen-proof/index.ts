import { NextApiRequest, NextApiResponse } from "next";
const snarkjs = require("snarkjs");
import path from "path";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { circuitName, inputs } = req.body;
      const directory = path.join(process.cwd(), "keys");
      const circuitWasmPath = directory + `/${circuitName}.wasm`;
      const circuitFinalZkeyPath = directory + `/${circuitName}_final.zkey`;

      let result = { isSuccessful: false, message: "", proof: null, publicSignals: null };

      try {
        console.log("inputs: ", inputs);
        console.log("circuitWasmPath: ", circuitWasmPath);
        console.log("circuitFinalZkeyPath: ", circuitFinalZkeyPath);
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(inputs, circuitWasmPath, circuitFinalZkeyPath);
        // console.log("Proof: ", JSON.stringify(proof, null, 1));
        result.proof = proof;
        result.publicSignals = publicSignals;
        result.isSuccessful = true;
        result.message = "Proof OK";
        res.status(200).json(result);
      } catch (err: any) {
        result.isSuccessful = false;
        result.message = err.message;
        console.error("Server Error Generating Proof: ", err.message);
        res.status(500).json(result);
        return;
      }
    } catch (err: any) {
      console.log("Server error: ", err.message);
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    console.log("Error: Method must be POST");
    res.status(405).json({ error: "Method must be POST" });
  }
};

export default handler;
