type Node = {
  id: number;
  title: string;
  description: string;
  question: string;
  edges: { id: number; action: string; next: number }[];
};

export default Node;