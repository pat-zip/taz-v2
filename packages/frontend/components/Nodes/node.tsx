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
      <div className="flex flex-row justify-between h-full">
        <div className="flex flex-col justify-between py-8 w-[600px]">
          <p className="p-5 text-left">{data.description}</p>
          <div className="flex flex-col text-left items-start px-5">
            {data.edges.length > 0 ? (
              <div>
                <h4 className="font-bold">Choose an option:</h4>
                <ul className="text-left p-2">
                  {data.edges.map((option: any) => {
                    if (option.next) {
                      return (
                        <li
                          className="cursor-pointer py-1 hover:bg-gray-300 px-2"
                          key={option.id}
                          onClick={() => next(option.next)}
                        >
                          [ {option.action} ]
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
        <div className="w-[600px] bg-gray-100">
          <img className="h-full" src={data.image} alt="image" />
        </div>
      </div>
  );
};

export default CurrentNode;
