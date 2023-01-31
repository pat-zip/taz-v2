import React, { useState } from "react";
import { useRouter } from "next/router";
import RepValue from "./RepValue";
import Stat from "./Stat";

interface Props {}

const Player: React.FC<Props> = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [level, setLevel] = useState(1);
  const [avatarUrl, setAvatarUrl] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkms62ywj8noI96YorLX4kg6qHaHcq5lhoj_VYj9I0-A&s"
  );
  const [stats, setStats] = useState([
    { name: "Strength", bits: 8, color: "red", posRep: 0, negRep: 0, prove: 0 },
    { name: "Constitution", bits: 8, color: "orange", posRep: 0, negRep: 0, prove: 0 },
    { name: "Dexterity", bits: 8, color: "yellow", posRep: 0, negRep: 0, prove: 0 },
    { name: "Perception", bits: 8, color: "green", posRep: 0, negRep: 0, prove: 0 },
    { name: "Charisma", bits: 8, color: "blue", posRep: 0, negRep: 0, prove: 0 },
    { name: "Gold", bits: 8, color: "indigo", posRep: 0, negRep: 0, prove: 0 },
    { name: "Items", bits: 8, color: "purple", posRep: 0, negRep: 0, prove: 0 },
    { name: "XP Points", bits: 8, color: "pink", posRep: 0, negRep: 0, prove: 0 },
  ]);

  const calculateReputation = (
    stats: Array<{ name: string; color: string; posRep: number; negRep: number; prove: number }>
  ) => {
    let posRep = 0;
    let negRep = 0;
    for (let i = 0; i < stats.length; i++) {
      posRep += stats[i].posRep * 2 ** ((stats.length - 1 - i) * 8);
      negRep += stats[i].negRep * 2 ** ((stats.length - 1 - i) * 8);
    }
    console.log("posRep: ", posRep, (posRep >>> 0).toString(2));
    console.log("negRep: ", negRep, (negRep >>> 0).toString(2));
    return [posRep, negRep];
  };
  const [posRep, setPosRep] = useState(0);
  const [negRep, setNegRep] = useState(0);
  const [isSending, setIsSending] = useState(false);

  //   const [sendAttestation] = useMutation(SEND_ATTESTATION, {
  //     variables: { username, level, avatarUrl, stats, reputation },
  //     onCompleted: () => {
  //       setIsSending(false);
  //       router.push("/");
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //       setIsSending(false);
  //     },
  //   });

  const handleStatChange = (index: number, posRep: number, negRep: number, prove: number) => {
    const newStats = [...stats];
    newStats[index].posRep = posRep;
    newStats[index].negRep = negRep;
    newStats[index].prove = prove;
    setStats(newStats);
    const [posRepCalc, negRepCalc] = calculateReputation(newStats);
    setPosRep(posRepCalc);
    setNegRep(negRepCalc);
  };

  const handleSendAttestation = () => {
    setIsSending(true);
    // sendAttestation();
  };

  return (
    <div className="flex flex-col m-12">
      <h2 className="text-2xl mb-6">Reputation Breakdown</h2>
      {/* <div className="mb-4">
        <h3 className="text-xl">User Info</h3>
        <div className="flex items-center">
          <img className="w-10 h-10 rounded-full mr-4" src={avatarUrl} alt="Avatar" />
          <div>
            <p className="text-lg font-medium">{username}</p>
            <p className="text-sm">Level: {level}</p>
          </div>
        </div>
      </div> */}
      <div className="flex flex-wrap items-center gap-6">
        {stats.map((stat, index) => (
          <Stat key={stat.name} stat={stat} index={index} onStatChange={handleStatChange} />
        ))}
      </div>
      <div className="flex item-center mb-2">
        <div className="text-xl mr-4 w-20 h-">Pos Rep</div>
        <RepValue reputation={posRep} stats={stats} />
      </div>
      <div className="flex item-center mb-6">
        <div className="text-xl mr-4 w-20">Neg Rep</div>
        <RepValue reputation={negRep} stats={stats} />
      </div>

      <button
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
      </button>
    </div>
  );
};

export default Player;
