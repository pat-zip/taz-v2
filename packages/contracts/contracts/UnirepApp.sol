// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {Unirep} from "@unirep/contracts/Unirep.sol";
import "./ProveRepRegisterVerifier.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract UnirepApp {
    Unirep public unirep;
    ProveRepRegisterVerifier public proveRepRegisterVerifier;
    error AttesterInvalid();
    error InvalidEpochKey();
    error InvalidProof();

    /*
     * @param _unirep contract address
     * @param ProveRepRegisterVerifier contract address
     * @param _epochLength used to set an epoch length when registering as an attester on the Unirep contract
     */
    constructor(
        Unirep _unirep,
        ProveRepRegisterVerifier _proveRepRegisterVerifier,
        uint256 _epochLength
    ) {
        // set unirep address
        unirep = _unirep;

        // set rep register verifier address
        proveRepRegisterVerifier = _proveRepRegisterVerifier;

        // sign up as an attester
        unirep.attesterSignUp(_epochLength);
    }

    /*
     *  allows a user to sign up in this app
     * @param publicSignals: an array of uint256 representing public signals that are used to identify the user
     * @param proof: an array of 8 uint256 that serve as a proof for the user's reputation.
     */
    function userSignUp(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public {
        console.log("UnirepApp Contract: userSignUp");
        console.log("public signal 0 - identityCommitment: ", publicSignals[0]);
        console.log("public signal 2 - attester Id: ", uint256(uint160(address(this))), " should = ", publicSignals[2]);
        console.log("public signal 3 - epoch: ", publicSignals[3]);

        console.log("proof");
        console.log(proof[0]);
        console.log("unirep address");
        console.log(address(unirep));

        unirep.userSignUp(publicSignals, proof);
    }

    /*
     *  submit attestation
     * @param epochKey: epoch key in which the attestation was intended. Revert if this is not the current epoch
     * @param posRep: positive reputation of the user being attested
     * * @param negRep: negative reputation of the user being attested
     * * @param proof: positive reputation score of the user being attested
     *
     */ function submitAttestation(
        uint256 targetEpoch,
        uint256 epochKey,
        uint256 posRep,
        uint256 negRep,
        uint256 graffiti
    ) public {
        
        uint256 epk = unirep.attesterCurrentEpoch(uint160(address(this)));
        
        console.log("UnirepApp Contract: submitAttestation");
        console.log("targetEpoch: ", targetEpoch, " should = ", epk);
        console.log("epochKey: ", epochKey);
        console.log("posRep: ", posRep);
        console.log("negRep: ", negRep);
        console.log("graffiti: ", graffiti);
        
        unirep.submitAttestation(
            targetEpoch,
            epochKey,
            posRep,
            negRep,
            graffiti
        );
    }

    // verify reputation register proof
    function verifyRepRegisterProof(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public {
        // input[0] = epoch | public[0]
        // input[1] = nonce | public[1]
        // input[2] = epoch key (output) | public[2]
        // input[3] = identify nullifier
        // input[4] = global state tree indexes
        // input[5] = global state tree elements
        // input[6] = attester id | public[3]
        // input[7] = posRep
        // input[8] = negRep
        // input[9] = graffiti

        bool valid = proveRepRegisterVerifier.verifyProof(publicSignals, proof);
        if (!valid) revert InvalidProof();
        if (publicSignals[0] >= unirep.maxEpochKey()) revert InvalidEpochKey();
        if (publicSignals[3] >= type(uint160).max) revert AttesterInvalid();
        unirep.updateEpochIfNeeded(uint160(publicSignals[3]));

        // We can't do the part below yet because the attester data store isn't public

        // AttesterData storage attester = attesters[uint160(publicSignals[3])];

        // // epoch check
        // if (publicSignals[2] > attester.currentEpoch)
        //     revert unirep.InvalidEpoch(publicSignals[2]);

        // // state tree root check
        // if (!attester.stateTreeRoots[publicSignals[2]][publicSignals[1]])
        //     revert unirep.InvalidStateTreeRoot(publicSignals[1]);
    }

    // get attester epoch
    function attesterCurrentEpoch() public view returns (uint256) {
        return unirep.attesterCurrentEpoch(uint160(address(this)));
    }

    // get attester epoch remaining time
    function attesterEpochRemainingTime() public view returns (uint256) {
        return unirep.attesterEpochRemainingTime(uint160(address(this)));
    }

    // get state tree depth
    function stateTreeDepth() public view returns (uint8) {
        return unirep.stateTreeDepth();
    }

    // get attester start timestamp
    function attesterStartTimestamp(
        uint160 attesterId
    ) public view returns (uint256) {
        return unirep.attesterStartTimestamp(attesterId);
    }
}
