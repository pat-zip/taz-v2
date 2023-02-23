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
  GiHearts,
} from "react-icons/gi";

const Nodes = () => {
  const [gameOver, setGameOver] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [nodeData, setNodeData] = useState(null);
  const [stats, setStats] = useState(null);
  const [clearedChallenges, setClearedChallenges] = useState(null);

  const updateGameData = (next) => {
    let updatedStats = {};
    const statChanges = nodeData.stat_changes.statChanges;

    for (let i = 0; i < statChanges.length; i++) {
      updatedStats[statChanges[i].stat] =
        stats[statChanges[i].stat] + statChanges[i].modifier;
    }
    localStorage.setItem(
      "stats",
      JSON.stringify({ ...stats, ...updatedStats })
    );

    // const updatedStats = { ...stats, [stat]: value };
    // localStorage.setItem("stats", JSON.stringify(updatedStats));
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
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className="w-[1200px] bg-gray-100 flex flex-col justify-center border-2 border-gray-500">
        {stats ? (
          <div className="flex flex-row p-3 text-white bg-black justify-between">
            <div className="flex flex-row items-start">
              <div className="flex justify-center items-center mx-3">
                <GiBiceps size="1.6rem" />
                <h4 className="text-md ml-1 text-lg">STR: {stats.Strength}</h4>
              </div>
              <div className="flex justify-center items-center mx-3">
                <GiWingfoot size="1.6rem" />
                <h4 className="text-md ml-1 text-lg">DEX: {stats.Dexterity}</h4>
              </div>
              <div className="flex justify-center items-center mx-3">
                <GiHeartPlus size="1.6rem" />
                <h4 className="text-md ml-1 text-lg">
                  CON: {stats.Constitution}
                </h4>
              </div>
              <div className="flex justify-center items-center mx-3">
                <AiFillEye size="1.6rem" />
                <h4 className="text-md ml-1 text-lg">
                  PER: {stats.Perception}
                </h4>
              </div>
              <div className="flex justify-center items-center mx-3">
                <GiDualityMask size="1.6rem" />
                <h4 className="text-md ml-1 text-lg">CHA: {stats.Charisma}</h4>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex justify-center items-center mx-3">
                <GiHearts size="1.6rem" />
                <h4 className="text-md ml-1 text-lg">{stats.Life}</h4>
              </div>
              <div className="flex justify-center items-center mx-3">
                <BiCoin size="1.6rem" />
                <h4 className="text-md ml-1 text-lg">{stats.Gold}</h4>
              </div>
              <h4 className="text-md ml-1 text-lg">XP {stats.Experience}</h4>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="flex flex-col bg-gray-200 text-center w-full text-black h-[500px]">
          {currentNode && nodeData ? renderNode() : "loading"}
        </div>
      </div>
    </div>
  );
};

export default Nodes;
