import React, { useEffect } from "react";
import parse from "html-react-parser";

interface Props {
  reputation: number;

  registers: Array<{
    name: string;
    bits: number;
    color: string;
    posRep: number;
    negRep: number;
    minValue: number;
  }>;
}

const RepValue: React.FC<Props> = ({ reputation, registers }) => {
  const colorReputation = (reputationNum: number) => {
    let reputation = reputationNum
      .toString(registers.length * 2)
      .padStart(registers.length * 2, "0");

    let colorReputation = "";
    let currentStat = 0;
    for (let i = 0; i < reputation.length; i++) {
      if (i % 2 === 0 && i !== 0) {
        currentStat++;
      }
      colorReputation += `<span className="${registers[currentStat].color}">${reputation[i]}</span>`;
    }
    return colorReputation;
  };

  // TODO: Find a better way of doing this that doesnt' involve dangerouslySetInnerHTML - CHECK
  return (
    <div className="text-4xl">
      <span style={{ color: "#000000" }}>0x</span>
      {parse(colorReputation(reputation))}
    </div>
  );
};

export default RepValue;
