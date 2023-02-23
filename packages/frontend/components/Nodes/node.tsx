import { FC } from "react";

import { AiOutlineMenu } from "react-icons/ai";

import { BiCoin, BiUser, BiHeart, BiShield } from "react-icons/bi";

import {
  GiBroadsword,
  GiBroadDagger,
  GiFrontTeeth,
  GiFocusedLightning,
} from "react-icons/gi";

import { BsLightningCharge } from "react-icons/bs";

import Node from "../../types/Node";

type Props = {
  data: Node;
  updateGameData: Function;
  setGameOver: Function;
};

const CurrentNode: FC<Props> = ({ data, updateGameData, setGameOver }) => {
  function next(next: number) {
    if (next) {
      updateGameData(next);
    } else {
      setGameOver(true);
    }
  }

  return (
    <div className="flex flex-col my-5 p-1 text-center w-[900px] text-white max-h-screen">
      <div className="flex justify-between items-center h-50 rounded-md my-5 w-full">
      </div>
      <p>{data.description}</p>
      <div className="mt-6 border-2 border-white flex flex-col text-left items-start px-5 py-5 rounded-md h-full">
        {data.edges.length > 0 ? (
          <div>
            <h4 className="font-bold">Choose an option:</h4>
            <ul className="w-[600px] text-left p-2">
              {data.edges.map((option: any) => {
                if (option.next) {
                  return (
                    <li
                      className="cursor-pointer py-1 hover:bg-gray-300 px-2"
                      key={option.id}
                      onClick={() => next(option.next)}
                    >
                      {option.action}
                    </li>
                  );
                } else {
                  return (
                    <li className="py-1 text-gray-300 px-2" key={option.id}>
                      {option.action}
                    </li>
                  );
                }
              })}
            </ul>
          </div>
         ) : (
          <button onClick={() => next(data.next)}>Continue</button>
        )}
      </div>
    </div>
  );
};

export default CurrentNode;
