
include "../../../../node_modules/circomlib/circuits/comparators.circom";

template PackedBitChecker(input_length) {
    signal input input_signal;
    signal input min_value;
    signal input index;
    signal input byte_length;
    component gte[1];

    // First, shift the input_signal by "8 * (input_signal.length / 8 - index - byte_length)" bits. 
    // This moves the byte of interest to the rightmost position of the signal.
    // Next, the result is bitwise ANDed with ((1 << (8 * byte_length))-1) to extract only the relevant bytes. 

    // var byte_of_interest = (input_signal >> (8 * index)) & ((1 << (8 * byte_length))-1); // index goes right to left
    var shifted_signal = (input_signal >> (8 * (input_length / 8 - index - byte_length)));
    var byte_of_interest = (input_signal >> (8 * (input_length / 8 - index - byte_length))) & ((1 << (8 * byte_length))-1); 

    log("shifted_signal: ");
    log(shifted_signal);
    log("((1 << (8 * byte_length))-1): ");
    log(((1 << (8 * byte_length))-1));
    log("input_signal: ");
    log(input_signal);
    log("min_value: ");
    log(min_value);
    log("byte_of_interest: ");
    log(byte_of_interest);

    gte[0] = GreaterEqThan(32);
    gte[0].in[0] <-- byte_of_interest;
    gte[0].in[1] <== min_value; 
    gte[0].out === 1;
}

component main { public [ min_value, index, byte_length ]} = PackedBitChecker(64);