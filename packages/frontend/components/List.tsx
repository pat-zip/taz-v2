import * as React from "react";
import ListItem from "./ListItem";
import { User } from "../interfaces";

type Props = {
  items: User[];
};

const List = ({ items }: Props) => (
  <ul className="flex flex-wrap justify-center sm:justify-between w-full space-y-5 sm:space-y-0">
    {items.map((item) => (
      <li key={item.id} className="w-60 h-60 shadow-3xl rounded-md">
        <ListItem data={item} />
      </li>
    ))}
  </ul>
);

export default List;
