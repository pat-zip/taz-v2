import { useState, useEffect } from "react";
import CurrentNode from "./node";
import Combat from "./combat";
import Puzzle from "./puzzle";

const Nodes = () => {
  const [currentNode, setCurrentNode] = useState(1);
  const [nodeData, setNodeData] = useState(null);
  const [amountCleared, setAmountCleared] = useState(0);

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
      return <CurrentNode data={nodeData} setCurrentNode={setCurrentNode} />;
    }
  }

  return <div className="flex justify-center">{nodeData ? renderNode() : "loading"}</div>;
};

export default Nodes;
