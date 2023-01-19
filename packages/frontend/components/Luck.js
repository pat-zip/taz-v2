import React, { useState } from 'react';

function Luck() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTryLuck = () => {
    const luck = Math.floor(Math.random() * 100) + 1;
    if (luck > 50) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  };

  return (
    <div>
      <button className="bg-yellow-500 text-white p-2 rounded-lg mr-2 mt-4 hover:bg-yellow-600" onClick={handleTryLuck}>
        Try your Luck
      </button>
      {isSuccess ? (
        <p className="text-base text-green-600 text-center">You have succeeded! You can move on to the next one</p>
      ) : (
        <p className="text-base text-red-600 text-center">Unlucky. Try again.</p>
      )}
    </div>
  );
}

export default Luck;
