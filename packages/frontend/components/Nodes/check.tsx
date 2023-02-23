const Check = ({ stats, setCurrentNode, data, clearedChallenges }) => {
  const statCheck = data.stat_checks[0];
  const determineSuccess = () => {
    if (stats[statCheck.stat] >= statCheck.treshold) {
      return true;
    } else {
      return false;
    }
  };

  const updateStats = () => {
    let updatedStats = {};
    let statChanges = [];

    if (determineSuccess()) {
      statChanges = statCheck.success.statChanges;
    } else {
      statChanges = statCheck.fail.statChanges;
    }
    for (let i = 0; i < statChanges.length; i++) {
      updatedStats[statChanges[i].stat] =
        stats[statChanges[i].stat] + statChanges[i].modifier;
    }
    localStorage.setItem(
      "stats",
      JSON.stringify({ ...stats, ...updatedStats })
    );
  };

  const updateClearedStatChecks = () => {
    const updatedStatChecks = [
      ...clearedChallenges["stat_checks"],
      statCheck.id,
    ];
    const updatedChallenges = {
      ...clearedChallenges,
      ["stat_checks"]: updatedStatChecks,
    };
    localStorage.setItem(
      "clearedChallenges",
      JSON.stringify(updatedChallenges)
    );
  };

  const next = () => {
    updateStats();
    updateClearedStatChecks();
    if (determineSuccess()) {
      localStorage.setItem("currentNode", statCheck.success.next.toString());
      setCurrentNode(statCheck.success.next);
    } else {
      localStorage.setItem("currentNode", statCheck.fail.next.toString());
      setCurrentNode(statCheck.fail.next);
    }
  };

  return (
    <div className="flex flex-row justify-between h-full">
      <div className="flex flex-col justify-between py-8 w-[600px]">
        {determineSuccess() ? (
          <div>
            <p>{statCheck.success.text}</p>
            <p>
              Your {statCheck.success.statChanges[0].stat} increases by{" "}
              {statCheck.success.statChanges[0].modifier}
            </p>
          </div>
        ) : (
          <div>
            <p>{statCheck.fail.text}</p>
            <p>
              Your {statCheck.fail.statChanges[0].stat} decreases by{" "}
              {statCheck.fail.statChanges[0].modifier}
            </p>
          </div>
        )}
        <button
          className="cursor-pointer py-1 hover:bg-gray-300 px-2"
          onClick={() => next()}
        >
          {"[ Continue ]"}
        </button>
      </div>
      <div className="w-[600px] bg-gray-100">
        <img className="h-full" src={data.image} alt="image" />
      </div>
    </div>
  );
};

export default Check;
