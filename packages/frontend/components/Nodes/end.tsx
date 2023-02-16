import { useRouter } from "next/router";

const End = ({ initGame }) => {
  const router = useRouter();

  const resetGame = () => {
    initGame();
    router.reload();
  };

  return (
    <div className="flex flex-col items-center my-5 p-1 text-center w-[900px] text-white max-h-screen">
      <h1 className="text-2xl mb-5">End of the Story!</h1>
      <p>You have reached the end of this particular story branch.</p>
      <p>Want to play a new game?</p>
      <button className="border border-white p-2 my-4 w-[200px]" onClick={() => resetGame()}>
        New Game
      </button>
    </div>
  );
};

export default End;
