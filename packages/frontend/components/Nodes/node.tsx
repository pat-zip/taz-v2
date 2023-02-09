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
      <div className="flex border-2 border-white justify-between items-center rounded-md px-5 py-2">
        <div className="flex">
          <BiUser size="1.5rem" />
          <h4 className="font-bold">Samuel Oh Lvl. 1</h4>
        </div>
        <div className="flex flex-col items-start">
          <h4 className="font-bold">EXP</h4>
          <h4>0/100 (0%)</h4>
        </div>
        <div className="flex">
          <BiCoin size="1.5rem" />
          <h4 className="font-bold">2.45k</h4>
        </div>
        <div className="flex border-2 border-white p-2 rounded-md">
          <AiOutlineMenu size="1.5rem" />
        </div>
      </div>
      <div className="flex justify-between items-center h-50 rounded-md my-5 w-full">
        <div className="flex flex-col items-start border-2 border-white h-full w-3/6 py-2 px-2 mr-5 rounded-md">
          <h4 className="text-lg font-bold">Stats</h4>
          <div className="flex justify-center items-center">
            <BiHeart size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">
              HP: 250/250 (100%)
            </h4>
          </div>
          <div className="flex justify-center items-center">
            <GiBroadsword size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">ATK: 250</h4>
          </div>
          <div className="flex justify-center items-center">
            <BiShield size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">DEF: 250</h4>
          </div>
          <div className="flex justify-center items-center">
            <GiBroadDagger size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">ATK.SPD: 0.5</h4>
          </div>
          <div className="flex justify-center items-center">
            <GiFrontTeeth size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">VAMP: 0%</h4>
          </div>
          <div className="flex justify-center items-center">
            <BsLightningCharge size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">C.RATE: 0%</h4>
          </div>
          <div className="flex justify-center items-center">
            <GiFocusedLightning size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">C.DMG: 50%</h4>
          </div>
        </div>
        <div className="flex flex-col items-start border-2 border-white h-full w-3/6 py-2 px-2 ml-5 rounded-md">
          <h4 className="text-lg font-bold">Bonus Stats</h4>
          <div className="flex justify-center items-center">
            <BiHeart size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">HP: +0%</h4>
          </div>
          <div className="flex justify-center items-center">
            <GiBroadsword size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">ATK: +0%</h4>
          </div>
          <div className="flex justify-center items-center">
            <BiShield size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">DEF: +0%</h4>
          </div>
          <div className="flex justify-center items-center">
            <GiBroadDagger size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">ATK.SPD: +0%</h4>
          </div>
          <div className="flex justify-center items-center">
            <GiFrontTeeth size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">VAMP: +0%</h4>
          </div>
          <div className="flex justify-center items-center">
            <BsLightningCharge size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">C.RATE: +0%</h4>
          </div>
          <div className="flex justify-center items-center">
            <GiFocusedLightning size="1.6rem" />
            <h4 className="text-md ml-1 text-lg">C.DMG: +0%</h4>
          </div>
        </div>
      </div>
      <h1 className="font-bold text-xl py-3">{data.title}</h1>
      <p>{data.description}</p>
      <div className="mt-6 border-2 border-white flex flex-col text-left items-start px-5 py-5 rounded-md h-full">
        <h4 className="font-bold">{data.question}</h4>
        <ul className="w-[600px] text-left p-2">
          {data.edges.map((option: any) => {
            return (
              <li
                className="cursor-pointer py-1 hover:bg-gray-300 px-2"
                key={option.id}
                onClick={() => next(option.next)}
              >
                {option.action}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CurrentNode;
