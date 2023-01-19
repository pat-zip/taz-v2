import React, { useState, useEffect } from 'react';

function Combat({ selectedMonster, setSelectedMonster }) {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(selectedMonster.health);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isSpecialAttacking, setIsSpecialAttacking] = useState(false);
  const [isDefending, setIsDefending] = useState(false);
  const [playerDamage, setPlayerDamage] = useState(0);
  const [monsterDamage, setMonsterDamage] = useState(0);
  const [playerSpecialDamage, setPlayerSpecialDamage] = useState(0);
  const [playerDefense, setPlayerDefense] = useState(0);

  useEffect(() => {
    setMonsterHealth(selectedMonster.health);
  }, [selectedMonster]);

  const handleAttack = () => {
    setIsAttacking(true);
    setIsSpecialAttacking(false);
    setIsDefending(false);
    //calculate damage
  };

  const handleSpecialAttack = () => {
    setIsSpecialAttacking(true);
    setIsAttacking(false);
    setIsDefending(false);
    //calculate special damage
  };

  const handleDefend = () => {
    setIsDefending(true);
    setIsAttacking(false);
    setIsSpecialAttacking(false);
    //increase player defense
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
      setSelectedMonster(null);
    }
  }, [monsterHealth, setSelectedMonster]);

  return (
    <div>
      {selectedMonster && (
        <>
          <p className="text-base text-red-600 text-center">A {selectedMonster.name} appeared!</p>
          <p className="text-base text-red-600 text-center">{selectedMonster.name}'s health: {monsterHealth}</p>
          <p className="text-base text-red-600 text-center">Your health: {playerHealth}</p>
          <p className="text-base text-red-600 text-center">Your damage: {playerDamage}</p>
          <p className="text-base text-red-600 text-center">Your special damage: {playerSpecialDamage}</p>
<p className="text-base text-red-600 text-center">Your defense: {playerDefense}</p>
<div className="mt-4 flex justify-center">
<button className="bg-red-500 text-white p-2 rounded-lg mr-2 mt-4 hover:bg-red-600" onClick={handleAttack}>
Attack
</button>
<button
           className="bg-red-500 text-white p-2 rounded-lg mr-2 mt-4 hover:bg-red-600"
           onClick={handleSpecialAttack}
         >
Special
</button>
<button className="bg-red-500 text-white p-2 rounded-lg mr-2 mt-4 hover:bg-red-600" onClick={handleDefend}>
Defend
</button>
</div>
</>
)}
</div>
);
}

export default Combat;
