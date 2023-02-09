import { useState, useEffect } from "react";
import CurrentNode from "./node";
import Combat from "./combat";
import Puzzle from "./puzzle";
import End from "./end";

const Nodes = () => {
  const [gameOver, setGameOver] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [nodeData, setNodeData] = useState(null);
  const [amountCleared, setAmountCleared] = useState(0);
  const [stats, setStats] = useState(null);

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
    const initialStats = { Strength: 0, Dexterity: 0, Experience: 0, Gold: 0 };
    const initialNode = 1;
    localStorage.setItem("stats", JSON.stringify(initialStats));
    localStorage.setItem("currentNode", initialNode.toString());
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

  async function clearChallenge() {
    await fetch("/api/game/clearChallenge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ node: currentNode }),
    });
    setAmountCleared(amountCleared + 1);
  }

  function getGameData() {
    const savedStats = localStorage.getItem("stats");
    const savedNode = localStorage.getItem("currentNode");

    if (!savedStats || !savedNode) {
      initGame();
    } else {
      getNodeData(savedNode);
      setStats(JSON.parse(savedStats));
      setCurrentNode(parseInt(savedNode));
      console.log("current Node: ", currentNode);
      console.log("current Stats: ", stats);
    }
  }

  useEffect(() => {
    getGameData();
  }, [currentNode, amountCleared]);

  function renderNode() {
    if (gameOver) {
      return <End />;
    } else {
      if (nodeData.hasChallenge && !nodeData.isCleared) {
        switch (nodeData.challengeType) {
          case "monster":
            return (
              <Combat
                clearChallenge={clearChallenge}
                selectedMonster={nodeData.monsters[0]}
              />
            );
          case "puzzle":
            return (
              <Puzzle clearChallenge={clearChallenge} selectedPuzzle={1} />
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
    <div className="flex flex-col justify-center">
      {stats ? (
        <div className="flex flex-row justify-center p-2">
          <p className="mx-2">Strength: {stats.Strength}</p>
          <p className="mx-2">Dexterity: {stats.Dexterity}</p>
          <p className="mx-2">Experience: {stats.Experience}</p>
          <p className="mx-2">Gold: {stats.Gold}</p>
        </div>
      ) : (
        ""
      )}
      <div className="flex justify-center">
        {currentNode && nodeData ? renderNode() : "loading"}
      </div>
    </div>
  );
};

export default Nodes;
