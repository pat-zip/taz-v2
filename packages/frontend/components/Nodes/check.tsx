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
    <div className="flex flex-col items-center my-5 p-1 text-center w-[900px] text-white max-h-screen">
      <h2>Checking stat: {data.stat_checks[0].stat}</h2>
      <p>Treshold: {data.stat_checks[0].treshold}</p>
      {determineSuccess() ? (
        <p>{data.stat_checks[0].success.text}</p>
      ) : (
        <p>{data.stat_checks[0].fail.text}</p>
      )}
      <button
        className="border border-white p-2 my-4 w-[200px]"
        onClick={() => next()}
      >
        Continue
      </button>
    </div>
  );
};

export default Check;
