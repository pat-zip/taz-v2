
include "../../../../node_modules/circomlib/circuits/comparators.circom";
include "../../../../node_modules/circomlib/circuits/poseidon.circom";
include "../circuits/incrementalMerkleTree.circom";

template ProveRepRegister(STATE_TREE_DEPTH, REP_LENGTH) {

    signal input identity_nullifier;
    signal input attester_id;
    signal input epoch;
    signal input pos_rep;
    signal input neg_rep;
    signal input graffiti;
    signal input timestamp;
    // Register
    signal input min_register_value;
    signal input register_index;
    signal input byte_length;
    // Global state tree
    signal input state_tree_indexes[STATE_TREE_DEPTH];
    signal input state_tree_elements[STATE_TREE_DEPTH][1];
    signal output state_tree_root;    

    // Check if user exists in the Global State Tree 

    component leaf_hasher = Poseidon(7);
    leaf_hasher.inputs[0] <== identity_nullifier;
    leaf_hasher.inputs[1] <== attester_id;
    leaf_hasher.inputs[2] <== epoch;
    leaf_hasher.inputs[3] <== pos_rep;
    leaf_hasher.inputs[4] <== neg_rep;
    leaf_hasher.inputs[5] <== graffiti;
    leaf_hasher.inputs[6] <== timestamp;

    component state_merkletree = MerkleTreeInclusionProof(STATE_TREE_DEPTH);
    state_merkletree.leaf <== leaf_hasher.out;
    for (var i = 0; i < STATE_TREE_DEPTH; i++) {
        state_merkletree.path_index[i] <== state_tree_indexes[i];
        state_merkletree.path_elements[i] <== state_tree_elements[i][0];
    }
    state_tree_root <== state_merkletree.root;

    // Check if the byte of interest is greater than or equal to min_value:
    // First, shift the input_signal by "8 * (INPUT_LENGTH / 8 - register_index - byte_length)" bits. 
    // This moves the byte of interest to the rightmost position of the signal.
    // Next, the result is bitwise ANDed with ((1 << (8 * byte_length))-1) to extract only the relevant bytes. 

    var total_reputation = pos_rep - neg_rep;
    var byte_of_interest = (total_reputation >> (8 * (REP_LENGTH / 8 - register_index - byte_length))) & ((1 << (8 * byte_length))-1); 

    log("((1 << (8 * byte_length))-1): ");
    log(((1 << (8 * byte_length))-1));
    log("total_reputation: ");
    log(total_reputation);
    log("min_register_value: ");
    log(min_register_value);
    log("byte_of_interest: ");
    log(byte_of_interest);

    component gte[1];
    gte[0] = GreaterEqThan(32);
    gte[0].in[0] <-- byte_of_interest;
    gte[0].in[1] <== min_register_value; 
    gte[0].out === 1;
}

component main { public [ min_register_value, register_index, byte_length ]} = ProveRepRegister(20, 64);