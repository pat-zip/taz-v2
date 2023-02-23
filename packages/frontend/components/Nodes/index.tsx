import { useState, useEffect } from "react";
import CurrentNode from "./node";
import Combat from "./combat";
import End from "./end";
import Check from "./check";
import { AiOutlineMenu, AiFillEye } from "react-icons/ai";
import { BiCoin, BiUser, BiHeart, BiShield } from "react-icons/bi";
import {
  GiBiceps,
  GiHeartPlus,
  GiDualityMask,
  GiWingfoot,
} from "react-icons/gi";

import { BsLightningCharge } from "react-icons/bs";

const Nodes = () => {
  const [gameOver, setGameOver] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [nodeData, setNodeData] = useState(null);
  const [stats, setStats] = useState(null);
  const [clearedChallenges, setClearedChallenges] = useState(null);

  const updateGameData = (next) => {
    const stat = nodeData.stat;
    const value = stats[stat] + nodeData.modifier;
    const updatedStats = { ...stats, [stat]: value };
    localStorage.setItem("stats", JSON.stringify(updatedStats));
    localStorage.setItem("currentNode", next.toString());
    setCurrentNode(next);
  };

  const initGame = () => {
    console.log("Initializing new game");
    const initialStats = {
      Strength: 10,
      Constitution: 10,
      Dexterity: 10,
      Perception: 10,
      Charisma: 10,
      Gold: 0,
      Items: 0,
      Experience: 0,
      Life: 100,
    };
    const initialNode = 1;
    const initalClearedChallenges = {
      combat: [],
      stat_checks: [],
    };
    localStorage.setItem("stats", JSON.stringify(initialStats));
    localStorage.setItem("currentNode", initialNode.toString());
    localStorage.setItem(
      "clearedChallenges",
      JSON.stringify(initalClearedChallenges)
    );

    setCurrentNode(1);
  };

  async function getNodeData(node) {
    await fetch("/api/game/getNodeData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ node: node }),
    })
      .then((response) => response.json())
      .then((data) => {
        setNodeData(data);
      });
  }

  function getGameData() {
    const savedStats = localStorage.getItem("stats");
    const savedNode = localStorage.getItem("currentNode");
    const clearedChallenges = localStorage.getItem("clearedChallenges");

    if (!savedStats || !savedNode) {
      initGame();
    } else {
      getNodeData(savedNode);
      setStats(JSON.parse(savedStats));
      setCurrentNode(parseInt(savedNode));
      setClearedChallenges(JSON.parse(clearedChallenges));

      console.log("current Node: ", currentNode);
      console.log("current Stats: ", stats);
      console.log("current cleared challenges: ", clearedChallenges);
    }
  }

  useEffect(() => {
    getGameData();
  }, [currentNode]);

  function renderNode() {
    console.log("type? ", nodeData.type);
    if (!gameOver) {
      switch (nodeData.type) {
        case "combat":
          return <Combat selectedMonster={nodeData.monsters[0]} />;
        case "stat_check":
          return (
            <Check
              setCurrentNode={setCurrentNode}
              clearedChallenges={clearedChallenges}
              stats={stats}
              data={nodeData}
            />
          );
        case "story":
          return (
            <CurrentNode
              data={nodeData}
              updateGameData={updateGameData}
              setGameOver={setGameOver}
            />
          );
      }
    } else {
      return <End initGame={initGame} />;
    }
  }

  return (
    <div className="flex flex-col bg-black min-h-screen justify-center items-center border-2 border-black">
      {stats ? (
        <div className="flex flex-row border-2 border-white w-[400px] h-full w-3/6 py-2 px-2 mr-5 rounded-md text-white bg-black justify-between p-3">
          <div className="flex flex-col items-start">
            <div className="flex justify-center items-center">
              <GiBiceps size="1.6rem" />
              <h4 className="text-md ml-1 text-lg">
                Strength: {stats.Strength}
              </h4>
            </div>
            <div className="flex justify-center items-center">
              <GiWingfoot size="1.6rem" />
              <h4 className="text-md ml-1 text-lg">
                Dexterity: {stats.Dexterity}
              </h4>
            </div>
            <div className="flex justify-center items-center">
              <GiHeartPlus size="1.6rem" />
              <h4 className="text-md ml-1 text-lg">
                Constitution: {stats.Constitution}
              </h4>
            </div>
            <div className="flex justify-center items-center">
              <AiFillEye size="1.6rem" />
              <h4 className="text-md ml-1 text-lg">
                Perception: {stats.Perception}
              </h4>
            </div>
            <div className="flex justify-center items-center">
              <GiDualityMask size="1.6rem" />
              <h4 className="text-md ml-1 text-lg">
                Charisma: {stats.Charisma}
              </h4>
            </div>
          </div>
          <div>
            <h4>Life: {stats.Life}</h4>
            <h4>Gold: {stats.Gold}</h4>
            <h4>XP: {stats.Experience}</h4>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="flex justify-center border-2 border-black">
        {currentNode && nodeData ? renderNode() : "loading"}
      </div>
    </div>
  );
};

export default Nodes;
