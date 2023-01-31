import React, { useState, createRef } from "react";

interface Props {
  stat: {
    name: string;
    color: string;
    posRep: number;
    posRnegRepep: number;
    prove: number;
    bits: number;
  };
  index: number;
  onStatChange: (index: number, posRep: number, negRep: number, prove: number) => void;
}

const Stat: React.FC<Props> = ({ stat, index, onStatChange }) => {
  const [posRep, setPosRep] = useState(0);
  const [negRep, setNegRep] = useState(0);
  const [prove, setProve] = useState(0);
  const posRepInput = createRef<HTMLInputElement>();
  const negRepInput = createRef<HTMLInputElement>();
  const proveInput = createRef<HTMLInputElement>();
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  const setPosRepWithMinMaxCheck = (val: number) => {
    const min = parseInt(posRepInput.current.min);
    const max = parseInt(posRepInput.current.max);
    if (val < min) setPosRep(min);
    else if (val > max) setPosRep(max);
    else setPosRep(val);
  };

  const setNegRepWithMinMaxCheck = (val: number) => {
    const min = parseInt(negRepInput.current.min);
    const max = parseInt(negRepInput.current.max);
    if (val < min) setNegRep(min);
    else if (val > max) setNegRep(max);
    else setNegRep(val);
  };

  const setProveWithMinMaxCheck = (val: number) => {
    const min = parseInt(proveInput.current.min);
    const max = parseInt(proveInput.current.max);
    if (val < min) setProve(min);
    else if (val > max) setProve(max);
    else setProve(val);
  };

  const handleSubmitProof = () => {
    setIsSubmittingProof(true);
    // sendAttestation();
  };

  return (
    <div className="border border-gray-200 rounded-md p-6">
      <div className="flex items-center mb-2">
        <div className={`w-6 h-6 rounded-full bg-${stat.color}-500 mr-2`}></div>
        <div>
          <div className="text-xl font-bold">{stat.name}</div>
          <div className="text-sm">{stat.bits} Bits</div>
        </div>
      </div>

      <div className="flex items-center mr-4 mb-2">
        <div className="pr-2 w-20">Positive</div>
        <button
          className={`bg-gray-200 text-black rounded-full p-2`}
          onClick={() => {
            setPosRepWithMinMaxCheck(posRep - 1);
            onStatChange(index, posRep - 1, negRep, prove);
          }}
        >
          -
        </button>
        <input
          ref={posRepInput}
          className={`border border-${stat.color}-500 rounded-full p-2 w-20`}
          value={posRep}
          onChange={(e) => {
            setPosRepWithMinMaxCheck(parseInt(e.target.value));
            onStatChange(index, parseInt(e.target.value), negRep, prove);
          }}
          type="number"
          min={0}
          max={2147483647}
        />
        <button
          className={`bg-gray-200 text-black rounded-full p-2`}
          onClick={() => {
            setPosRepWithMinMaxCheck(posRep + 1);
            onStatChange(index, posRep + 1, negRep, prove);
          }}
        >
          +
        </button>
      </div>

      <div className="flex items-center mr-4 mb-4 pb-4 border-b">
        <div className="pr-2 w-20">Negative</div>
        <button
          className={`bg-gray-200 text-black rounded-full p-2`}
          onClick={() => {
            setNegRepWithMinMaxCheck(negRep - 1);
            onStatChange(index, posRep, negRep - 1, prove);
          }}
        >
          -
        </button>
        <input
          ref={negRepInput}
          className={`border border-${stat.color}-500 rounded-full p-2 w-20`}
          value={negRep}
          onChange={(e) => {
            setNegRepWithMinMaxCheck(parseInt(e.target.value));
            onStatChange(index, posRep, parseInt(e.target.value), prove);
          }}
          type="number"
          min={0}
          max={2147483647}
        />
        <button
          className={`bg-gray-200 text-black rounded-full p-2`}
          onClick={() => {
            setNegRepWithMinMaxCheck(negRep + 1);
            onStatChange(index, posRep, negRep + 1, prove);
          }}
        >
          +
        </button>
      </div>

      <div className="flex items-center mr-4 mb-2">
        <div className="pr-2 w-20">Prove</div>
        <button
          className={`bg-gray-200 text-black rounded-full p-2`}
          onClick={() => {
            setProveWithMinMaxCheck(prove - 1);
            onStatChange(index, posRep, negRep, prove - 1);
          }}
        >
          -
        </button>
        <input
          ref={proveInput}
          className={`border border-${stat.color}-500 rounded-full p-2 w-20`}
          value={prove}
          onChange={(e) => {
            setProveWithMinMaxCheck(parseInt(e.target.value));
            onStatChange(index, posRep, negRep, parseInt(e.target.value));
          }}
          type="number"
          min={0}
          max={2147483647}
        />
        <button
          className={`bg-gray-200 text-black rounded-full p-2`}
          onClick={() => {
            setProveWithMinMaxCheck(negRep + 1);
            onStatChange(index, posRep, negRep, prove + 1);
          }}
        >
          +
        </button>
      </div>

      <button
        className={
          "bg-gray-500 text-white rounded-full py-2 px-4" + (isSubmittingProof ? "cursor-not-allowed opacity-50" : "")
        }
        onClick={handleSubmitProof}
        disabled={isSubmittingProof}
      >
        {isSubmittingProof ? (
          <div className="w-6 h-6 mr-2 border-4 border-gray-900 rounded-full animate-spin" />
        ) : (
          "Submit Proof"
        )}
      </button>
    </div>
  );
};

export default Stat;
