import { FC } from "react";
import Node from "../../types/Node";

type Props = {
  data: Node;
  setCurrentNode: Function;
};

const CurrentNode: FC<Props> = ({ data, setCurrentNode }) => {
  function next(next: number) {
    setCurrentNode(next);
  }

  return (
    <div className="container p-5 text-center w-[900px]">
      <h1 className="font-bold text-xl py-3">{data.title}</h1>
      <p>{data.description}</p>
      <div className="p-5 mt-6 bg-gray-100 flex flex-col text-left items-start">
        <h4 className="font-bold">{data.question}</h4>
        <ul className="w-[600px] text-left p-2">
          {data.edges.map((option: any) => {
            return (
              <li
                className="cursor-pointer py-1 hover:bg-gray-300 px-2"
                key={option.id}
                onClick={() => next(option.next)}
              >
                {option.action}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CurrentNode;
