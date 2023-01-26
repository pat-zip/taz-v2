type Node = {
  id: number;
  title: string;
  description: string;
  question: string;
  edges: { id: number; action: string; next: number }[];
  monsters: { id: number; name: string; health: number; damage: number };
  hasChallenge: boolean;
  isCleared: boolean;
  challengeType: string;
};

export default Node;
