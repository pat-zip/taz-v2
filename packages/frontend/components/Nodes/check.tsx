const Check = ({ stats, setCurrentNode, data }) => {
  const determineSuccess = () => {
    if (stats[data.stat_checks[0].stat] >= data.stat_checks[0].treshold) {
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
      stat = data.stat_checks[0].success.stat;
      value = stats[stat] + data.stat_checks[0].success.modifier;
    } else {
      stat = data.stat_checks[0].fail.stat;
      value = stats[stat] + data.stat_checks[0].fail.modifier;
      if (value < 0) {
        value = 0;
      }
    }

    updatedStats = { ...stats, [stat]: value };
    localStorage.setItem("stats", JSON.stringify(updatedStats));
  };

  const next = () => {
    updateStats();
    localStorage.setItem("currentNode", data.stat_checks[0].next.toString());
    setCurrentNode(data.stat_checks[0].next);
  };

  return (
    <div className="flex flex-col items-center my-5 p-1 text-center w-[900px] text-white max-h-screen">
      <h2>Checking stat: {data.stat_checks[0].stat}</h2>
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
