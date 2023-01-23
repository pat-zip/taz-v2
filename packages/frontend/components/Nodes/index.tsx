import { useState, useEffect } from "react";
import CurrentNode from "./node";

const Nodes = () => {
  const [currentNode, setCurrentNode] = useState(1);
  const [nodeData, setNodeData] = useState(null);

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

  useEffect(() => {
    getNodeData();
  }, [currentNode]);

  return (
    <div>
      {nodeData ? (
        <CurrentNode data={nodeData} setCurrentNode={setCurrentNode} />
      ) : (
        "loading"
      )}
    </div>
  );
};

export default Nodes;
