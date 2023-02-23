type Node = {
  id: number;
  description: string;
  image: string;
  XP: number;
  edges: { id: number; action: string; next: number }[];
  monsters: { id: number; name: string; health: number; damage: number };
  challenge: { type: string };
  next: number;
};

export default Node;
