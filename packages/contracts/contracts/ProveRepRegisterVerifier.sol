// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library Pairing {
    uint256 constant PRIME_Q =
        21888242871839275222246405745257275088696311157297823662689037894645226208583;

    struct G1Point {
        uint256 X;
        uint256 Y;
    }

    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint256[2] X;
        uint256[2] Y;
    }

    /*
     * @return The negation of p, i.e. p.plus(p.negate()) should be zero.
     */
    function negate(G1Point memory p) internal pure returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        if (p.X == 0 && p.Y == 0) {
            return G1Point(0, 0);
        } else {
            return G1Point(p.X, PRIME_Q - (p.Y % PRIME_Q));
        }
    }

    /*
     * @return The sum of two points of G1
     */
    function plus(G1Point memory p1, G1Point memory p2)
        internal
        view
        returns (G1Point memory r)
    {
        uint256[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }

        require(success, 'pairing-add-failed');
    }

    /*
     * @return The product of a point on G1 and a scalar, i.e.
     *         p == p.scalar_mul(1) and p.plus(p) == p.scalar_mul(2) for all
     *         points p.
     */
    function scalar_mul(G1Point memory p, uint256 s)
        internal
        view
        returns (G1Point memory r)
    {
        uint256[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }
        require(success, 'pairing-mul-failed');
    }

    /* @return The result of computing the pairing check
     *         e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
     *         For example,
     *         pairing([P1(), P1().negate()], [P2(), P2()]) should return true.
     */
    function pairing(
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2,
        G1Point memory c1,
        G2Point memory c2,
        G1Point memory d1,
        G2Point memory d2
    ) internal view returns (bool) {
        G1Point[4] memory p1 = [a1, b1, c1, d1];
        G2Point[4] memory p2 = [a2, b2, c2, d2];

        uint256 inputSize = 24;
        uint256[] memory input = new uint256[](inputSize);

        for (uint256 i = 0; i < 4; i++) {
            uint256 j = i * 6;
            input[j + 0] = p1[i].X;
            input[j + 1] = p1[i].Y;
            input[j + 2] = p2[i].X[0];
            input[j + 3] = p2[i].X[1];
            input[j + 4] = p2[i].Y[0];
            input[j + 5] = p2[i].Y[1];
        }

        uint256[1] memory out;
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(
                sub(gas(), 2000),
                8,
                add(input, 0x20),
                mul(inputSize, 0x20),
                out,
                0x20
            )
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }

        require(success, 'pairing-opcode-failed');

        return out[0] != 0;
    }
}

contract ProveRepRegisterVerifier {

    using Pairing for *;

    uint256 constant SNARK_SCALAR_FIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    uint256 constant PRIME_Q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    struct VerifyingKey {
        Pairing.G1Point alpha1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[8] IC;
    }

    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }

    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alpha1 = Pairing.G1Point(
            uint256(10949786798491044469091178044829355152097999316476015697562585832189437872044),
            uint256(20420756870772681904563585476983216943934721021224346847450600373431585228484)
        );

        vk.beta2 = Pairing.G2Point(
            [uint256(8325665799399551029127358292931415101404432006931524301414118214590202302454),
             uint256(373443004676567204392931813461970627837770312234742094754890963081365501521)],
            [uint256(21886998047804537259426057856353914076719224769872262484726052335228211134203),
             uint256(12694440542735264899059949262571557589270202728003365448878624126771795102681)]
        );
        vk.gamma2 = Pairing.G2Point(
            [uint256(11559732032986387107991004021392285783925812861821192530917403151452391805634),
             uint256(10857046999023057135944570762232829481370756359578518086990519993285655852781)],
            [uint256(4082367875863433681332203403145435568316851327593401208105741076214120093531),
             uint256(8495653923123431417604973247489272438418190587263600148770280649306958101930)]
        );
        vk.delta2 = Pairing.G2Point(
            [uint256(20014076911872751534883785203011043682610572730502176170552407109441905957414),
             uint256(11439294606549065703579129790871684504318287004429875813133954379338756760713)],
            [uint256(14175510401400386851240422144432621927732482559171021566298402133368370850744),
             uint256(4461956760918251832181072278309944964327254338894586069718851743740991054874)]
        );
    
        vk.IC[0] = Pairing.G1Point( 
            uint256(20975004059303306653905105770583597686912018165007228339458653100857179134026),
            uint256(17507994532180350279439866871389235620793650237179744433630234607553725220520)
        );                                      
        
        vk.IC[1] = Pairing.G1Point( 
            uint256(12106295800949900621602881058258411009874365432607262973920629986579084492605),
            uint256(1922088464768305152262656972934518629378134814884021147390925523435354014665)
        );                                      
        
        vk.IC[2] = Pairing.G1Point( 
            uint256(3822440874955662534908148843944518841978399464739827002125903604297621777834),
            uint256(9101300890725570507457861497237195859797665015511323656087808574876686813438)
        );                                      
        
        vk.IC[3] = Pairing.G1Point( 
            uint256(7798209002213216281277231216815244774698637539194782702184249246400858607294),
            uint256(13841403487421445265627488827227629655175508732984897338480336608590934313594)
        );                                      
        
        vk.IC[4] = Pairing.G1Point( 
            uint256(13907567824648754309064796484368334232089558109018044164630863160188622098270),
            uint256(20925610926025467218310447889426019908280257658052464167407475181982885671159)
        );                                      
        
    }

    /*
     * @returns Whether the proof is valid given the hardcoded verifying key
     *          above and the public inputs
     */
    function verifyProof(
        uint256[] calldata input,
        uint256[8] calldata _proof
    ) public view returns (bool) {

        Proof memory proof;
        proof.A = Pairing.G1Point(_proof[0], _proof[1]);
        proof.B = Pairing.G2Point([_proof[2], _proof[3]], [_proof[4], _proof[5]]);
        proof.C = Pairing.G1Point(_proof[6], _proof[7]);

        VerifyingKey memory vk = verifyingKey();

        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);

        // Make sure that proof.A, B, and C are each less than the prime q
        require(proof.A.X < PRIME_Q, "verifier-aX-gte-prime-q");
        require(proof.A.Y < PRIME_Q, "verifier-aY-gte-prime-q");

        require(proof.B.X[0] < PRIME_Q, "verifier-bX0-gte-prime-q");
        require(proof.B.Y[0] < PRIME_Q, "verifier-bY0-gte-prime-q");

        require(proof.B.X[1] < PRIME_Q, "verifier-bX1-gte-prime-q");
        require(proof.B.Y[1] < PRIME_Q, "verifier-bY1-gte-prime-q");

        require(proof.C.X < PRIME_Q, "verifier-cX-gte-prime-q");
        require(proof.C.Y < PRIME_Q, "verifier-cY-gte-prime-q");

        // Make sure that every input is less than the snark scalar field
        //for (uint256 i = 0; i < input.length; i++) {
        for (uint256 i = 0; i < 4; i++) {
            require(input[i] < SNARK_SCALAR_FIELD,"verifier-gte-snark-scalar-field");
            vk_x = Pairing.plus(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        }

        vk_x = Pairing.plus(vk_x, vk.IC[0]);

        return Pairing.pairing(
            Pairing.negate(proof.A),
            proof.B,
            vk.alpha1,
            vk.beta2,
            vk_x,
            vk.gamma2,
            proof.C,
            vk.delta2
        );
    }
}
