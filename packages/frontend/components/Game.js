import React, { useState } from 'react';
import data from './data/data.json';
import monsters from './data/monsters.json';
import puzzles from './data/puzzles.json';
import Combat from './Combat';
import Puzzle from './Puzzle';
import Luck from './Luck';

function Game() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [isChoice, setIsChoice] = useState(false);
  const [isChallengeComplete, setIsChallengeComplete] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState("");
  const [selectedPuzzle, setSelectedPuzzle] = useState("");
  const [userAnswer, setUserAnswer] = useState();
  const [strength, setStrength] = useState(5);
  const [dexterity, setDexterity] = useState(5);
  const [intelligence, setIntelligence] = useState(5);
  const [charisma, setCharisma] = useState(5);
  const [constitution, setConstitution] = useState(5);
  const [perception, setPerception] = useState(5);
  const [gold, setGold] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  const handleChoice = choiceIndex => {
    setSelectedChoice(choiceIndex);
    setIsChoice(true);
    console.log("Choice Index", choiceIndex)
  };

  const handleNext = () => {
    if (data[currentIndex].isChallenge) {
      if (selectedChoice === 0) {
        const randomIndex = Math.floor(Math.random() * monsters.length);
        setSelectedMonster(monsters[randomIndex]);
      } else if (selectedChoice === 1) {
        const randomIndex = Math.floor(Math.random() * puzzles.length);
        setSelectedPuzzle(puzzles[randomIndex]);
      } else {
        const luckValue = Math.floor(Math.random() * 100);
        if (luckValue > 50) {
          setCurrentIndex(data[currentIndex].choices[selectedChoice].nextIndex);
        } else {
          alert("You were unlucky, try again");
        }
      }
    } else {
      const nextIndex = data[currentIndex].choices[selectedChoice].nextIndex;
      setCurrentIndex(nextIndex);
      setSelectedChoice(null);
      setIsChoice(false);
      console.log("Next Index", nextIndex)

    }
  };

  const handleCombat = () => {
    if (selectedMonster.health > 0) {
      // code for the battle
      const damage = calculateDamage();
      selectedMonster.health -= damage;
      // code to update user's stats, gold and XP
    } else {
      setSelectedMonster(null);
      setCurrentIndex(currentIndex + 1);
      alert("Challenge complete! You can move on to the next one.")
    }
  };

  const calculateDamage = () => {
    // code to calculate damage based on user's stats and monster's stats
    // for example:
    const damage = strength + dexterity - selectedMonster.defense;
    return damage;
  }

  return (
    <div className="bg-gray-800 p-4 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-medium text-gray-800 text-center">{data[currentIndex].title}</h2>
        <p className="text-base text-gray-600 text-center">{data[currentIndex].description}</p>
        <p className="text-base text-gray-600 text-center">{data[currentIndex].question}</p>
        <p className="text-base text-green-600 text-center">{data[currentIndex].reward}</p>
        {data[currentIndex].isChallenge && (
          <div>
            {selectedMonster !== "" && (
              <Combat selectedMonster={selectedMonster} setSelectedMonster={setSelectedMonster} setCurrentIndex={setCurrentIndex} />
            )}
            {selectedPuzzle !== "" && (
              <Puzzle selectedPuzzle={selectedPuzzle} setSelectedPuzzle={setSelectedPuzzle} setCurrentIndex={setCurrentIndex} userAnswer={userAnswer} setUserAnswer={setUserAnswer}/>
            )}
            {selectedChoice === 2 && (
              <Luck setCurrentIndex={setCurrentIndex} />
            )}
            {data[currentIndex].choices.map((choice, index) => (
              <button
                key={index}
                className={`bg-blue-500 text-white p-2 rounded-lg mr-2 mt-4 hover:bg-blue-600 ${
                  selectedChoice === index ? "bg-blue-600" : ""
                }`}
                onClick={() => handleChoice(index)}
              >
                {choice.text}
              </button>
            ))}
            {selectedMonster !== "" &&(
              <button
                className="bg-green-500 text-white p-2 rounded-lg mt-4 hover:bg-green-600"
                onClick={handleCombat}
              >
                Battle
              </button>
            )} 
          </div>
        )}
        {!data[currentIndex].isChallenge && (
          <div className='flex justify-center'>
            {data[currentIndex].choices.map((choice, index) => (
              <button
                key={index}
                className={`bg-blue-500 text-white p-2 rounded-lg mr-2 mt-4 hover:bg-blue-600 ${
                  selectedChoice === index ? "bg-blue-600" : ""
                }`}
                onClick={() => handleChoice(index)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}
        { isChoice === true && (
            <div className="flex justify-center">
              <button
                className="bg-green-500 text-white p-2 rounded-lg mt-4 hover:bg-green-600"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
            )}
      </div>
    </div>
  );
}

export default Game;


