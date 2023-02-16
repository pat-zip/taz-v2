import { SERVER } from "../../../config";

export default {
  verifyProof: async (circuitName, publicSignals, proof) => {
    const input = { circuitName, publicSignals, proof };
    try {
      const res = await fetch("/api/verify-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const { isVerified, message } = await res.json();
      return isVerified;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  genProofAndPublicSignals: async (circuitName, inputs) => {
    const params = { circuitName, inputs };
    try {
      const res = await fetch("/api/gen-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const { isSuccessful, message, proof, publicSignals } = await res.json();
      return { proof, publicSignals };
    } catch (error) {
      console.log(error);
      return { proof: null, publicSignals: null };
    }
  },

  //  The below browser-based version isn't working in Next.js -- it gives an error about not
  //  being able to access the fs module. So posting to the back end instead.

  //   verifyProof: async (circuitName, publicSignals, proof) => {
  //     const snarkjs = await import(/* webpackPrefetch: true */ "snarkjs");
  //     const url = new URL(`/build/${circuitName}.vkey.json`, SERVER);
  //     const vkey = await fetch(url.toString()).then((r) => r.json());
  //     return snarkjs.groth16.verify(vkey, publicSignals, proof);
  //   },
  //   genProofAndPublicSignals: async (circuitName, inputs) => {
  //     const snarkjs = await import(/* webpackPrefetch: true */ "snarkjs");
  //     const wasmUrl = new URL(`/build/${circuitName}.wasm`, SERVER);
  //     const wasm = await fetch(wasmUrl.toString()).then((r) => r.arrayBuffer());
  //     const zkeyUrl = new URL(`/build/${circuitName}.zkey`, SERVER);
  //     const zkey = await fetch(zkeyUrl.toString()).then((r) => r.arrayBuffer());
  //     const { proof, publicSignals } = await snarkjs.groth16.fullProve(
  //       inputs,
  //       new Uint8Array(wasm),
  //       new Uint8Array(zkey)
  //     );
  //     return { proof, publicSignals };
  //   },
};
