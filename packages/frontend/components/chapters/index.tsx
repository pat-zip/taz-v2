import { useState, useEffect } from "react";
import CurrentChapter from "./chapter";
import Chapter from "../../types/Chapter";
import ChaptersJSON from "../../data/chapters.json";

const Chapters = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const chapters: Chapter[] = ChaptersJSON;

  return (
    <div>
      {chapters ? (
        <CurrentChapter chapter={chapters[currentIndex]} setCurrentIndex={setCurrentIndex}/>
      ) : (
        "loading"
      )}
    </div>
  );
};

export default Chapters;
