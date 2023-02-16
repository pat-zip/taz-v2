"use strict";

import { UserState } from "@unirep/core/src/UserState";

const utils_1 = require("@unirep/utils");
const contracts_1 = require("@unirep/contracts");
const circuits_1 = require("@unirep/circuits");

class AppUserState extends UserState {
  constructor(config) {
    super(config);

    // Need to customize the method below to use custom circuit

    /**
     * Generate a reputation proof of current user state and given conditions
     * @param epkNonce The nonce determines the output of the epoch key
     * @param minRep The amount of reputation that user wants to prove. It should satisfy: `posRep - negRep >= minRep`
     * @returns The reputation proof of type `ReputationProof`.
     */
    this.genProveRepRegisterProof = async (options) => {
      const { epkNonce, minRep, graffitiPreImage } = options;
      this._checkEpkNonce(epkNonce);
      const epoch = await this.latestTransitionedEpoch();
      const leafIndex = await this.latestStateTreeLeafIndex(epoch);
      const { posRep, negRep, graffiti, timestamp } = await this.getRepByAttester();
      const stateTree = await this.genStateTree(epoch);
      const stateTreeProof = stateTree.createProof(leafIndex);
      const circuitInputs = {
        epoch,
        nonce: epkNonce,
        identity_nullifier: this.id.identityNullifier,
        state_tree_indexes: stateTreeProof.pathIndices,
        state_tree_elements: stateTreeProof.siblings,
        attester_id: this.attesterId,
        pos_rep: posRep,
        neg_rep: negRep,
        graffiti,
        timestamp,
        min_rep: minRep !== null && minRep !== void 0 ? minRep : 0,
        prove_graffiti: graffitiPreImage ? 1 : 0,
        graffiti_pre_image: graffitiPreImage !== null && graffitiPreImage !== void 0 ? graffitiPreImage : 0,
      };
      const results = await this.prover.genProofAndPublicSignals(
        "prove-rep-v1",
        (0, utils_1.stringifyBigInts)(circuitInputs)
      );
      return new contracts_1.ReputationProof(results.publicSignals, results.proof, this.prover);
    };

    // Duplicating this function below because it's not included in the UserState.d.ts file

    /**
     * Get the reputation object from a given attester
     * @param _attesterId The attester ID that the user queries
     * @param toEpoch The latest epoch that the reputation is accumulated
     * @returns The reputation object
     */
    this.getRepByAttester = async (_attesterId, toEpoch) => {
      let posRep = BigInt(0);
      let negRep = BigInt(0);
      let graffiti = BigInt(0);
      let timestamp = BigInt(0);
      const attesterId = _attesterId !== null && _attesterId !== void 0 ? _attesterId : this.attesterId;
      const signup = await this._db.findOne("UserSignUp", {
        where: {
          attesterId: attesterId.toString(),
          commitment: this.commitment.toString(),
        },
      });
      const allEpks = [];
      const latestTransitionedEpoch = await this.latestTransitionedEpoch();
      for (let x = 0; x < (toEpoch !== null && toEpoch !== void 0 ? toEpoch : latestTransitionedEpoch); x++) {
        const epks = Array(this.settings.numEpochKeyNoncePerEpoch)
          .fill(null)
          .map((_, i) =>
            (0, utils_1.genEpochKey)(
              this.id.identityNullifier,
              attesterId.toString(),
              x,
              i,
              2 ** this.settings.epochTreeDepth
            ).toString()
          );
        allEpks.push(...epks);
      }
      if (allEpks.length === 0) return { posRep, negRep, graffiti, timestamp };
      const attestations = await this._db.findMany("Attestation", {
        where: {
          epochKey: allEpks,
          attesterId: attesterId.toString(),
        },
        orderBy: {
          index: "asc",
        },
      });
      for (const a of attestations) {
        posRep += BigInt(a.posRep);
        negRep += BigInt(a.negRep);
        if (a.timestamp && BigInt(a.timestamp) > timestamp) {
          graffiti = BigInt(a.graffiti);
          timestamp = BigInt(a.timestamp);
        }
      }
      return { posRep, negRep, graffiti, timestamp };
    };
  }
}

export default AppUserState;
