type Chapter = {
  id: number;
  text: string;
  options: { id: number; text: string; next: number }[];
};

export default Chapter;