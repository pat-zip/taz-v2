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
    let stat: string;
    let value: number;
    let updatedStats: [];

    if (determineSuccess()) {
      stat = statCheck.success.stat;
      value = statCheck.success.modifier;
    } else {
      stat = statCheck.fail.stat;
      value = statCheck.fail.modifier;
      if (value < 0) {
        value = 0;
      }
    }

    updatedStats = { ...stats, [stat]: value };
    localStorage.setItem("stats", JSON.stringify(updatedStats));
  };

  const updateClearedStatChecks = () => {
    const updatedStatChecks = [
      ...clearedChallenges["stat_checks"],
      statCheck.id,
    ];
    console.log("Updated stat checks: ", updatedStatChecks);
    const updatedChallenges = {
      ...clearedChallenges,
      ["stat_checks"]: updatedStatChecks,
    };
    console.log("Updated challenges: ", updatedChallenges);
    localStorage.setItem(
      "clearedChallenges",
      JSON.stringify(updatedChallenges)
    );
  };

  const next = () => {
    updateStats();
    updateClearedStatChecks();
    localStorage.setItem("currentNode", statCheck.next.toString());
    setCurrentNode(statCheck.next);
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
