import { NextApiRequest, NextApiResponse } from "next";
import snarkjs from "snarkjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { inputSignal, minValue, index, byteLength } = req.body;
    const response = await snarkjs.groth16.fullProve(
      { input_signal: 43124, min_value: 168, index: 1, byte_length: 1 },
      "circuit.wasm",
      "circuit_final.zkey"
    );

    console.log(response);

    res.status(200).json(response.data[0]);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
