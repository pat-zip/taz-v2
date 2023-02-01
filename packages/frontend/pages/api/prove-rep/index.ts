import { NextApiRequest, NextApiResponse } from "next";
const snarkjs = require("snarkjs");
import fs from "fs";
import path from "path";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // if (req.method === "POST") {
  try {
    const directory = path.join(process.cwd(), "zkproof/prove-rep-v1");
    const circuitWasmPath = directory + "/circuit.wasm";
    const circuitFinalZkeyPath = directory + "/circuit_final.zkey";
    const verificationKeyJsonPath = directory + "/verification_key.json";

    const { inputSignal, minValue, index, byteLength } = req.body;

    let result = { isVerified: false, message: "" };

    try {
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        { input_signal: inputSignal, min_value: minValue, index: index, byte_length: byteLength }, // { input_signal: 43124, min_value: 168, index: 1, byte_length: 1 },
        circuitWasmPath,
        circuitFinalZkeyPath
      );
      // console.log("Proof: ", JSON.stringify(proof, null, 1));
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
      res.status(200).json(result);
      return;
    }
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
  // } else {
  //   res.status(405).json({ error: "Method must be POST" });
  // }
};

export default handler;
