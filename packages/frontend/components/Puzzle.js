import React, { useState } from 'react';

function Puzzle({ selectedPuzzle, setSelectedPuzzle }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [lives, setLives] = useState(3);
  const intelligence = 30;
  const handleSubmit = event => {
    event.preventDefault();
    if (userAnswer === selectedPuzzle.answer) {
      setIsCorrect(true);
      setSelectedPuzzle(null);
    } else {
      setIsCorrect(false);
      setLives(lives - 1);
    }
  };

  return (
    <div>
      {selectedPuzzle && (
        <>
          <p className="text-base text-blue-600 text-center">{selectedPuzzle.question}</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="p-2 rounded-lg mr-2 mt-4"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
            />
            <button className="bg-blue-500 text-white p-2 rounded-lg mr-2 mt-4 hover:bg-blue-600">
              Submit
            </button>
          </form>
          <p className="text-base text-center m-4">Lives: {lives}</p>
          {isCorrect && (
            <p className="text-base text-green-600 text-center">Correct! You can move on to the next one</p>
          )}
          {lives === 0 && <p className="text-base text-red-600 text-center">You have no more lives left!</p>}
          {!isCorrect && lives !== 0 &&
            <>
              {intelligence >= 10 && <p className="text-base text-center">Hint 1: This is your first hing</p>}
              {intelligence >= 20 && intelligence < 40 && <p className="text-base text-center">Hint 2: This is your second hint</p>}
              {intelligence >= 50 && <p className="text-base text-center">Hint 3: This is your third hint</p>}
            </>
          }
        </>
      )}
    </div>
  );
}

export default Puzzle;
