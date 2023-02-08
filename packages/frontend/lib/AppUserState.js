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
    this.genProveReputationProof = async (options) => {
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
        circuits_1.Circuit.proveReputation,
        (0, utils_1.stringifyBigInts)(circuitInputs)
      );
      return new contracts_1.ReputationProof(results.publicSignals, results.proof, this.prover);
    };
  }
}
