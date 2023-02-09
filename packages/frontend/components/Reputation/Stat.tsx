import React, { useState, createRef, useEffect } from "react";

interface Props {
  register: {
    name: string;
    color: string;
    posRep: number;
    negRep: number;
    minValue: number;
    bits: number;
  };
  index: number;
  onStatChange: (
    index: number,
    posRep: number,
    negRep: number,
    prove: number
  ) => void;
  onProveRep: (
    index: number,
    minValue: number
  ) => Promise<string | null>;
  handleDeleteRegister: (idx: number) => void;
  deleteModal: boolean;
  setDeleteModal: (deleteModal: boolean) => void;
}

const Stat: React.FC<Props> = ({
  register,
  index,
  onStatChange,
  onProveRep,
  handleDeleteRegister,
  deleteModal,
  setDeleteModal,
}) => {
  const [posRep, setPosRep] = useState<number>(0);
  const [negRep, setNegRep] = useState<number>(0);
  const [prove, setProve] = useState<number>(0);
  const posRepInput = createRef<HTMLInputElement>();
  const negRepInput = createRef<HTMLInputElement>();
  const proveInput = createRef<HTMLInputElement>();
  const [isSubmittingProveRep, setIsSubmittingProveRep] =
    useState<boolean>(false);
  const [proveRepResult, setProveRepResult] = useState<string | null>(
    null
  );
  const [indexToDelete, setIndexToDelete] = useState<number>(null);

  useEffect(() => {
    setPosRep(register.posRep);
    setNegRep(register.negRep);
    setProve(register.minValue);
  }, [register]);

  const setPosRepWithMinMaxCheck = (val: number) => {
    setProveRepResult(null);
    const min = parseInt(posRepInput.current.min);
    const max = parseInt(posRepInput.current.max);
    if (val < min) setPosRep(min);
    else if (val > max) setPosRep(max);
    else setPosRep(val);
  };

  const setNegRepWithMinMaxCheck = (val: number) => {
    setProveRepResult(null);
    const min = parseInt(negRepInput.current.min);
    const max = parseInt(negRepInput.current.max);
    if (val < min) setNegRep(min);
    else if (val > max) setNegRep(max);
    else setNegRep(val);
  };

  const setProveWithMinMaxCheck = (val: number) => {
    setProveRepResult(null);
    const min = parseInt(proveInput.current.min);
    const max = parseInt(proveInput.current.max);
    if (val < min) setProve(min);
    else if (val > max) setProve(max);
    else setProve(val);
  };

  const handleProveRep = async () => {
    setIsSubmittingProveRep(true);
    try {
      setProveRepResult(await onProveRep(index, prove));
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingProveRep(false);
    }
  };

  // TODO: Make max attribute on inputs dynamic based on the number of bits for that register

  return (
    <div className="flex justify-start items-center border border-natural-200 rounded-md p-4 bg-white">
      {deleteModal && index === indexToDelete && (
        <div
          id="modal-overlay-confirmation"
          className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex justify-center items-center"
          onClick={(e) => {
            const targetId = e.target as HTMLDivElement;
            if (targetId.id === "modal-overlay-confirmation") {
              setIndexToDelete(null);
              return setDeleteModal(false);
            }
          }}
        >
          <div className="z-10 bg-white p-10 flex flex-col rounded text-white">
            <label className="text-black">
              Are you sure want to remove{" "}
              <strong>{register.name} </strong>
              register ?
            </label>
            <div className="w-full mt-10">
              <button
                onClick={() => handleDeleteRegister(indexToDelete)}
                className="border-0 rounded-full p-1 w-full bg-red-500 text-white hover:bg-red-600 transition delay-20 mb-2"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setIndexToDelete(null);
                }}
                className="border-0 rounded-full p-1 w-full bg-neutral-500 text-white hover:bg-neutral-600 transition delay-20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-rainbow-0 bg-rainbow-1 bg-rainbow-2 bg-rainbow-3 bg-rainbow-4 bg-rainbow-5 bg-rainbow-6 bg-rainbow-7 bg-rainbow-8 bg-rainbow-9 bg-rainbow-10"></div>
      <div
        className={`w-4 h-12 rounded-md bg-${register.color} mr-4`}
      ></div>
      <div className="basis-1/4">
        <div className="text-xl font-bold">{register.name}</div>
        <div className="text-sm">{register.bits} Bits</div>
      </div>

      <div className="flex items-center mr-4">
        <div className="mr-2">Positive</div>
        <button
          className={`bg-neutral-200 h-8 w-8 rounded-md p-0 ${
            posRep === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-black"
          }`}
          onClick={() => {
            setPosRepWithMinMaxCheck(posRep - 1);
            onStatChange(index, posRep - 1, negRep, prove);
          }}
          disabled={posRep === 0 ? true : false}
        >
          -
        </button>
        <input
          ref={posRepInput}
          className="border-0 rounded-full p-2 w-10 text-center"
          value={posRep}
          onChange={(e) => {
            setPosRepWithMinMaxCheck(parseInt(e.target.value));
            onStatChange(
              index,
              parseInt(e.target.value),
              negRep,
              prove
            );
          }}
          type="number"
          min={0}
          max={2147483647}
        />
        <button
          className="bg-neutral-200 h-8 w-8 rounded-md p-0"
          onClick={() => {
            setPosRepWithMinMaxCheck(posRep + 1);
            onStatChange(index, posRep + 1, negRep, prove);
          }}
        >
          +
        </button>
      </div>

      <div className="flex items-center mr-4">
        <div className="m-2">Negative</div>
        <button
          className={`bg-neutral-200 h-8 w-8 rounded-md p-0
          ${
            posRep === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-black"
          }`}
          onClick={() => {
            setNegRepWithMinMaxCheck(negRep - 1);
            onStatChange(index, posRep, negRep - 1, prove);
          }}
        >
          -
        </button>
        <input
          ref={negRepInput}
          className="border-0 rounded-full p-2 w-10 text-center"
          value={negRep}
          onChange={(e) => {
            setNegRepWithMinMaxCheck(parseInt(e.target.value));
            onStatChange(
              index,
              posRep,
              parseInt(e.target.value),
              prove
            );
          }}
          type="number"
          min={0}
          max={2147483647}
        />
        <button
          className="bg-neutral-200 h-8 w-8 rounded-md p-0"
          onClick={() => {
            setNegRepWithMinMaxCheck(negRep + 1);
            onStatChange(index, posRep, negRep + 1, prove);
          }}
        >
          +
        </button>
      </div>

      <div className="flex items-center mr-4">
        <div className="m-2">Prove</div>
        <button
          className={`bg-neutral-200 h-8 w-8 rounded-md p-0
             ${
               posRep === 0
                 ? "text-gray-400 cursor-not-allowed"
                 : "text-black"
             }`}
          onClick={() => {
            setProveWithMinMaxCheck(prove - 1);
            onStatChange(index, posRep, negRep, prove - 1);
          }}
        >
          -
        </button>
        <input
          ref={proveInput}
          className="border-0 rounded-full p-2 w-10 text-center"
          value={prove}
          onChange={(e) => {
            setProveWithMinMaxCheck(parseInt(e.target.value));
            onStatChange(
              index,
              posRep,
              negRep,
              parseInt(e.target.value)
            );
          }}
          type="number"
          min={0}
          max={2147483647}
        />
        <button
          className="bg-neutral-200 h-8 w-8 rounded-md p-0"
          onClick={() => {
            setProveWithMinMaxCheck(prove + 1);
            onStatChange(index, posRep, negRep, prove + 1);
          }}
        >
          +
        </button>
      </div>

      <button
        className={`block w-36 h-10 bg-red-500 text-white rounded-full py-2 px-4 mx-auto  mr-2
   
        `}
        onClick={() => {
          setDeleteModal(true);
          setIndexToDelete(index);
        }}
      >
        Remove
      </button>

      <button
        className={
          "block w-36 h-10 bg-neutral-500 text-white rounded-full py-2 px-4 mx-auto" +
          (isSubmittingProveRep
            ? " cursor-not-allowed opacity-50"
            : "") +
          (proveRepResult === "true : Verification OK"
            ? " bg-success"
            : proveRepResult !== null
            ? " bg-error"
            : "")
        }
        onClick={handleProveRep}
        disabled={isSubmittingProveRep}
      >
        {isSubmittingProveRep ? (
          <div className="w-4 h-4 border-4 rounded-md animate-spin m-auto" />
        ) : proveRepResult === "true : Verification OK" ? (
          "Verified"
        ) : proveRepResult !== null ? (
          "Unverified"
        ) : (
          "Verify"
        )}
      </button>
    </div>
  );
};

export default Stat;
