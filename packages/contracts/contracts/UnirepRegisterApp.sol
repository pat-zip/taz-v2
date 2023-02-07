// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {Unirep} from "@unirep/contracts/Unirep.sol";
import "./ProveRepRegisterVerifier.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract UnirepRegisterApp {
    Unirep public unirep;
    ProveRepRegisterVerifier public proveRepRegisterVerifier;

    constructor(Unirep _unirep, ProveRepRegisterVerifier _proveRepRegisterVerifier, uint256 _epochLength) {
        // set unirep address
        unirep = _unirep;

        // set rep register verifier address
        proveRepRegisterVerifier = _proveRepRegisterVerifier;

        // sign up as an attester
        unirep.attesterSignUp(_epochLength);
    }

    // sign up users in this app
    function userSignUp(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public {
        unirep.userSignUp(publicSignals, proof);
    }

    // submit attestation
    function submitAttestation(
        uint256 targetEpoch,
        uint256 epochKey,
        uint256 posRep,
        uint256 negRep,
        uint256 graffiti
    ) public {
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
        if (!valid) revert unirep.InvalidProof();
        if (publicSignals[0] >= unirep.maxEpochKey) revert unirep.InvalidEpochKey(); 
        if (publicSignals[3] >= type(uint160).max) revert unirep.AttesterInvalid();
        unirep.updateEpochIfNeeded(uint160(publicSignals[3]));

        AttesterData storage attester = attesters[uint160(publicSignals[3])];

        // epoch check
        if (publicSignals[2] > attester.currentEpoch)
            revert unirep.InvalidEpoch(publicSignals[2]);

        // state tree root check
        if (!attester.stateTreeRoots[publicSignals[2]][publicSignals[1]])
            revert unirep.InvalidStateTreeRoot(publicSignals[1]);
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
    function attesterStartTimestamp(uint160 attesterId)
        public
        view
        returns (uint256)
    {
        return unirep.attesterStartTimestamp(attesterId);
    }
}
