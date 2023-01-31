import React, { useState } from "react";

interface Props {
  reputation: number;

  stats: Array<{
    name: string;
    color: string;
    value: number;
  }>;
}

const RepValue: React.FC<Props> = ({ reputation, stats }) => {
  const colorReputation = (reputationNum: number) => {
    let reputation = reputationNum.toString(stats.length * 2).padStart(stats.length * 2, "0");
    let colorReputation = "";
    let currentStat = 0;
    for (let i = 0; i < reputation.length; i++) {
      if (i % 2 === 0 && i !== 0) {
        currentStat++;
      }
      colorReputation += `<span style="color: ${stats[currentStat].color}">${reputation[i]}</span>`;
    }
    return colorReputation;
  };

  return (
    <div
      className="bg-gray-100 rounded-lg p-4 text-4xl"
      dangerouslySetInnerHTML={{ __html: "0x" + colorReputation(reputation) }}
    />
  );
};

export default RepValue;
