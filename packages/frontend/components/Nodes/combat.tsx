import React, { useState, useEffect } from "react";

function Combat({ selectedMonster, clearChallenge }) {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(
    selectedMonster ? selectedMonster.health : 0
  );
  const [isAttacking, setIsAttacking] = useState(false);
  const [isSpecialAttacking, setIsSpecialAttacking] = useState(false);
  const [isDefending, setIsDefending] = useState(false);
  const [playerDamage, setPlayerDamage] = useState(0);
  const [monsterDamage, setMonsterDamage] = useState(0);
  const [playerSpecialDamage, setPlayerSpecialDamage] = useState(0);
  const [playerDefense, setPlayerDefense] = useState(0);

  useEffect(() => {
    if (selectedMonster) {
      setMonsterHealth(selectedMonster.health);
    }
    console.log(selectedMonster);
  }, [selectedMonster]);

  const handleAttack = () => {
    setIsAttacking(true);
    setIsSpecialAttacking(false);
    setIsDefending(false);

    // calculate damage
    const damage = Math.floor(Math.random() * 10) + 5; // random damage between 5 and 15
    setPlayerDamage(damage);
    setMonsterHealth((prevHealth) => prevHealth - damage);

    // monster attacks
    const monsterDamage = Math.floor(Math.random() * 5) + 2; // random monster damage between 2 and 7
    setPlayerHealth((prevHealth) => prevHealth - monsterDamage);
  };

  const handleSpecialAttack = () => {
    setIsSpecialAttacking(true);
    setIsAttacking(false);
    setIsDefending(false);

    // calculate special damage
    const specialDamage = Math.floor(Math.random() * 20) + 10; // random special damage between 10 and 30
    setPlayerSpecialDamage(specialDamage);
    setMonsterHealth((prevHealth) => prevHealth - specialDamage);

    // monster attacks
    const monsterDamage = Math.floor(Math.random() * 5) + 2; // random monster damage between 2 and 7
    setPlayerHealth((prevHealth) => prevHealth - monsterDamage);
  };

  const handleDefend = () => {
    setIsDefending(true);
    setIsAttacking(false);
    setIsSpecialAttacking(false);

    // increase player defense
    setPlayerDefense((prevDefense) => prevDefense + 5);

    // monster attacks
    const monsterDamage = Math.floor(Math.random() * 5) + 2; // random monster damage between 2 and 7
    setPlayerHealth((prevHealth) => prevHealth - monsterDamage);
  };

  useEffect(() => {
    if (isAttacking) {
      //calculate damage
    } else if (isSpecialAttacking) {
      //calculate special damage
    } else if (isDefending) {
      //increase player defense
    }
  }, [isAttacking, isSpecialAttacking, isDefending]);

  useEffect(() => {
    if (monsterHealth <= 0) {
      clearChallenge();
    } else if (playerHealth <= 0) {
      alert("GAME OVER!");
    }
  }, [monsterHealth, playerHealth]);

  return (
    <div className="p-6 border rounded-lg w-[650px]">
      {selectedMonster && selectedMonster.health && (
        <>
          <h1 className="text-3xl text-center mb-5 font-bold">
            A {selectedMonster.name} appeared!
          </h1>
          <hr className="my-1" />
          <div className="flex flex-col items-center p-5">
            <img src={selectedMonster.image} />
          </div>
          <div className="bg-gray-100 rounded-lg p-4 px-6">
            <div className="flex flex-row justify-around font-bold mb-2">
              <p>Your health: {playerHealth}</p>
              <p>
                {selectedMonster.name}'s health: {monsterHealth}
              </p>
            </div>
            <div className="flex flex-row justify-between mt-4 items-center">
              <ul>
                <li>Your Last round damage: {playerDamage}</li>
                <li>Your Last round special damage: {playerSpecialDamage}</li>
                <li>Your Last round defense: {playerDefense}</li>
              </ul>
              <div className="flex flex-row items-center justify-center">
                <button
                  className="bg-red-500 text-white text-xl p-2 rounded-lg mx-1 hover:bg-red-600"
                  onClick={handleAttack}
                >
                  Attack
                </button>
                <button
                  className="bg-blue-500 text-white text-xl p-2 rounded-lg mx-1 hover:bg-blue-600"
                  onClick={handleSpecialAttack}
                >
                  Special
                </button>
                <button
                  className="bg-green-500 text-white text-xl p-2 rounded-lg mx-1 hover:bg-green-600"
                  onClick={handleDefend}
                >
                  Defend
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Combat;
