import React, { useState, useEffect } from "react";

function Combat({ selectedMonster, setSelectedMonster, setCurrentIndex }) {
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
    if (monsterHealth <= 0 || playerHealth <= 0) {
      setSelectedMonster(null);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  }, [monsterHealth, playerHealth, setSelectedMonster, setCurrentIndex]);

  useEffect(() => {
    if (monsterHealth <= 0) {
      setSelectedMonster(null);
    }
  }, [monsterHealth, setSelectedMonster]);

  return (
    <div>
      {selectedMonster && selectedMonster.health && (
        <>
          <p className="text-base text-red-600 text-center">
            A {selectedMonster.name} appeared!
          </p>
          <p className="text-base text-red-600 text-center">
            {selectedMonster.name}'s health: {monsterHealth}
          </p>
          <p className="text-base text-red-600 text-center">
            Your health: {playerHealth}
          </p>
          <p className="text-base text-red-600 text-center">
            Your Last round damage: {playerDamage}
          </p>
          <p className="text-base text-red-600 text-center">
            Your Last round special damage: {playerSpecialDamage}
          </p>
          <p className="text-base text-red-600 text-center">
            Your Last round defense: {playerDefense}
          </p>
          <div className="mt-4 flex justify-center">
            <button
              className="bg-red-500 text-white p-2 rounded-lg mr-2 mt-4 hover:bg-red-600"
              onClick={handleAttack}
            >
              Attack
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-lg mr-2 mt-4 hover:bg-red-600"
              onClick={handleSpecialAttack}
            >
              Special
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-lg mr-2 mt-4 hover:bg-red-600"
              onClick={handleDefend}
            >
              Defend
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Combat;
