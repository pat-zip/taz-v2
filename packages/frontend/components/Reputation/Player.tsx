import React, { useState } from "react";
import { useRouter } from "next/router";
import RepValue from "./RepValue";
import Stat from "./Stat";

interface Props {}

const Player: React.FC<Props> = () => {
  const router = useRouter();
  const [username, setUsername] = useState("monsterkilla95");
  const [level, setLevel] = useState(1);
  const [avatarUrl, setAvatarUrl] = useState(
    "https://www.w3schools.com/howto/img_avatar.png"
  );
  // TODO: Store stats in browser local storage and allow user to add them dynamically
  // TODO: Change naming throughout project from "stat" to "register"
  // Individual stat max: 32 bits | Total stat max: 252 bits
  const [stats, setStats] = useState([
    {
      name: "Strength",
      bits: 8,
      color: "rainbow-0",
      posRep: 0,
      negRep: 0,
      minValue: 0,
    },
    {
      name: "Constitution",
      bits: 8,
      color: "rainbow-1",
      posRep: 0,
      negRep: 0,
      minValue: 0,
    },
    {
      name: "Dexterity",
      bits: 8,
      color: "rainbow-2",
      posRep: 0,
      negRep: 0,
      minValue: 0,
    },
    {
      name: "Perception",
      bits: 8,
      color: "rainbow-3",
      posRep: 0,
      negRep: 0,
      minValue: 0,
    },
    {
      name: "Charisma",
      bits: 8,
      color: "rainbow-4",
      posRep: 0,
      negRep: 0,
      minValue: 0,
    },
    {
      name: "Gold",
      bits: 8,
      color: "rainbow-5",
      posRep: 0,
      negRep: 0,
      minValue: 0,
    },
    {
      name: "Items",
      bits: 8,
      color: "rainbow-6",
      posRep: 0,
      negRep: 0,
      minValue: 0,
    },
    {
      name: "XP Points",
      bits: 8,
      color: "rainbow-7",
      posRep: 0,
      negRep: 0,
      minValue: 0,
    },
  ]);

  // calculates the total reputation value
  // and returns an array with the total positive and negative reputation
  // the returned values are used to set the state of the posRep and negRep variables on handleStatChange() function
  const calculateReputation = (
    stats: Array<{
      name: string;
      color: string;
      posRep: number;
      negRep: number;
      minValue: number;
    }>
  ) => {
    let posRep = 0;
    let negRep = 0;
    for (let i = 0; i < stats.length; i++) {
      posRep += stats[i].posRep * 2 ** ((stats.length - 1 - i) * 8);
      negRep += stats[i].negRep * 2 ** ((stats.length - 1 - i) * 8);
    }
    console.log("posRep: ", posRep, posRep.toString(2)); // (posRep >>> 0).toString(2))
    console.log("negRep: ", negRep, negRep.toString(2)); // (pnegRep >>> 0).toString(2))
    return [posRep, negRep];
  };

  const [posRep, setPosRep] = useState(0);
  const [negRep, setNegRep] = useState(0);
  const [isSending, setIsSending] = useState(false);

  // updates the reputation value
  // it's passed to the Stat component as a prop to be used as a callback function to update the state of the stats
  const handleStatChange = (
    index: number,
    posRep: number,
    negRep: number,
    minValue: number
  ) => {
    //creates a copy of the stats array and updates the values of the selected stat
    const newStats = [...stats];
    newStats[index].posRep = posRep;
    newStats[index].negRep = negRep;
    newStats[index].minValue = minValue;
    setStats(newStats);
    // updates the reputation based on the new stats
    const [posRepCalc, negRepCalc] = calculateReputation(newStats);
    setPosRep(posRepCalc);
    setNegRep(negRepCalc);
  };

  // checks and proof the reputation value
  // it does that by invoking the prove-rep API endpoint
  // prove-rep generates the proof and returns it to the function
  const handleProveRep = async (
    indexParam: number,
    minValueParam: number
  ): Promise<string | null> => {
    try {
      // calculate the input signal by subtracting the negative reputation from the positive reputation.
      const inputSignal: number = posRep - negRep;
      // set the minimum value to the value passed as a parameter.
      const minValue: number = minValueParam;
      // set the index to the value passed as a parameter.
      const index: number = indexParam;
      const byteLength: number = 1;

      // Combine the values into a single object called "input"
      const input = {
        inputSignal,
        minValue: minValueParam,
        index: indexParam,
        byteLength,
      };
      console.log("input", input);

      // Send a POST request to the /api/prove-rep endpoint with the input as the body.
      const res = await fetch("/api/prove-rep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      // parse the response as JSON and extract the "isVerified" and "message" properties
      const { isVerified, message } = await res.json();
      return isVerified + " : " + message;
    } catch (error) {
      console.log(error);
      // If there's an error, return null
      return null;
    }
  };

  const handleSendAttestation = () => {
    setIsSending(true);
    // sendAttestation();
  };

  return (
    <div className="flex flex-col items-center mx-12 my-6">
      <h2 className="text-2xl mb-6">Reputation Registers</h2>
      <div className="flex border border-neutral-200 rounded-xl mb-6 bg-white">
        <div className="py-4 px-6">
          <h3 className="text-black text-xl mb-2">Sample User</h3>
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full mr-4"
              src={avatarUrl}
              alt="Avatar"
            />
            <div>
              <p className="text-lg font-medium">{username}</p>
              <p className="text-sm">Level: {level}</p>
            </div>
          </div>
        </div>
        <div className="px-6 pt-4 pb-6 bg-neutral-500 rounded-r-xl border-neutral-500 text-neutral-200 font-medium">
          <div className="mb-4">
            <div>Positive Reputation</div>
            <RepValue reputation={posRep} stats={stats} />
          </div>
          <div>
            <div>Negative Reputation</div>
            <RepValue reputation={negRep} stats={stats} />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-2">
        {stats.map((stat, index) => (
          <Stat
            key={stat.name}
            stat={stat}
            index={index}
            onStatChange={handleStatChange}
            onProveRep={handleProveRep}
          />
        ))}
      </div>

      {/* <button
        className={
          "bg-indigo-500 text-white rounded-full py-2 px-4" + (isSending ? "cursor-not-allowed opacity-50" : "")
        }
        onClick={handleSendAttestation}
        disabled={isSending}
      >
        {isSending ? (
          <div className="w-6 h-6 mr-2 border-4 border-gray-900 rounded-full animate-spin" />
        ) : (
          "Send Attestation"
        )}
      </button> */}
    </div>
  );
};

export default Player;
