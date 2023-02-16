const Check = ({ stats, updateGameData, clearChallenge, data }) => {
  const checkStat = () => {
    if (stats[data.stat_checks[0].stat] >= data.stat_checks[0].treshold) {
      return true;
    } else {
      return false;
    }
  };

  const next = () => {
    clearChallenge();
    updateGameData(data.stat_checks[0].next);
  };

  return (
    <div className="flex flex-col items-center my-5 p-1 text-center w-[900px] text-white max-h-screen">
      <h2>Checking stat: {data.stat_checks[0].stat}</h2>
      {checkStat() ? (
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
