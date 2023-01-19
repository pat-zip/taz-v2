import { FC } from "react";
import Chapter from "../../types/Chapter";

type Props = {
  chapter: Chapter;
  setCurrentIndex: Function;
};

const CurrentChapter: FC<Props> = ({ chapter, setCurrentIndex }) => {
  function next(next: number) {
    setCurrentIndex(next - 1);
  }

  return (
    <div className="container p-5 text-center w-[900px]">
      <h1 className="font-bold text-xl py-3">What Happens:</h1>
      <p>{chapter.text}</p>
      <div className="p-5 mt-6 bg-gray-100 flex flex-col text-left items-start">
      <h4 className="font-bold">Choose an action:</h4>
      <ul className="w-[600px] text-left p-2">
        {chapter.options.map((option: any) => {
          return (
            <li className="cursor-pointer py-1 hover:bg-gray-300 px-2" key={option.id} onClick={() => next(option.next)}>
              {option.id}.  {option.text}
            </li>
          );
        })}
      </ul>
      </div>
    </div>
  );
};

export default CurrentChapter;
