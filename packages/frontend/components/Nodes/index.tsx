import { useState, useEffect } from "react";
import CurrentNode from "./node";
import Combat from "./combat";
import Puzzle from "./puzzle";

const Nodes = () => {
  const [currentNode, setCurrentNode] = useState(1);
  const [nodeData, setNodeData] = useState(null);
  const [amountCleared, setAmountCleared] = useState(0);
  const [stats, setStats] = useState({
    Strength: 0,
    Dexterity: 0,
    Experience: 0,
    Gold: 0,
  });

  const updateStats = () => {
    console.log("triggered");
    const stat = nodeData.stat;
    const value = stats[stat] + nodeData.modifier;
    console.log("stat: ", stat, "modifier: ", nodeData.modifier)
    setStats({ ...stats, [stat]: value });
  };

  async function getNodeData() {
    await fetch("/api/game/getNodeData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ node: currentNode }),
    })
      .then((response) => response.json())
      .then((data) => setNodeData(data));
  }

  async function clearChallenge() {
    console.log("clear challenge called");
    await fetch("/api/game/clearChallenge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ node: currentNode }),
    });
    setAmountCleared(amountCleared + 1);
  }

  useEffect(() => {
    getNodeData();
  }, [currentNode, amountCleared]);

  function renderNode() {
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
          return <Puzzle clearChallenge={clearChallenge} selectedPuzzle={1} />;
      }
    } else {
      return <CurrentNode data={nodeData} setCurrentNode={setCurrentNode} updateStats={updateStats} />;
    }
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-row justify-center p-2">
        <p className="mx-2">Strength: {stats.Strength}</p>
        <p className="mx-2">Dexterity: {stats.Dexterity}</p>
        <p className="mx-2">Experience: {stats.Experience}</p>
        <p className="mx-2">Gold: {stats.Gold}</p>
      </div>
      <div className="flex justify-center">
        {nodeData ? renderNode() : "loading"}
      </div>
    </div>
  );
};

export default Nodes;
