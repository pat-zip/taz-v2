import { useState, useEffect } from "react";
import CurrentNode from "./node";
import Combat from "./combat";
import End from "./end";
import Check from "./check";

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
      Strength: 0,
      Constitution: 0,
      Dexterity: 0,
      Perception: 0,
      Charisma: 0,
      Gold: 0,
      Items: 0,
      Experience: 0,
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
    console.log("Challenge? ", nodeData.hasChallenge);
    if (gameOver) {
      return <End initGame={initGame} />;
    } else {
      if (
        nodeData.hasChallenge &&
        !clearedChallenges["stat_checks"].includes(nodeData.stat_checks[0].id)
      ) {
        switch (nodeData.challengeType) {
          case "monster":
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
        }
      } else {
        return (
          <CurrentNode
            data={nodeData}
            updateGameData={updateGameData}
            setGameOver={setGameOver}
          />
        );
      }
    }
  }

  return (
    <div className="flex flex-col bg-black min-h-screen justify-center border-2 border-black">
      {stats ? (
        <div className="flex flex-row justify-center p-2 text-white border-2 border-white">
          <p className="mx-2">Strength: {stats.Strength}</p>
          <p className="mx-2">Constitution: {stats.Constitution}</p>
          <p className="mx-2">Dexterity: {stats.Dexterity}</p>
          <p className="mx-2">Perception: {stats.Perception}</p>
          <p className="mx-2">Charisma: {stats.Charisma}</p>
          <p className="mx-2">Experience: {stats.Experience}</p>
          <p className="mx-2">Gold: {stats.Gold}</p>
          <p className="mx-2">Items: {stats.Items}</p>
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
