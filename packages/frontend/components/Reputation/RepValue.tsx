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
      colorReputation += `<span class="${stats[currentStat].color}">${reputation[i]}</span>`;
    }
    return colorReputation;
  };

  // TODO: Find a better way of doing this that doesnt' involve dangerouslySetInnerHTML
  return (
    <div
      className="text-4xl"
      dangerouslySetInnerHTML={{ __html: "<span style='color: #000000;'>0x</span>" + colorReputation(reputation) }}
    />
  );
};

export default RepValue;
