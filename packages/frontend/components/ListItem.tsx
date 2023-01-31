import React from "react";
import Link from "next/link";

import { User } from "../interfaces";

type Props = {
  data: User;
};

const ListItem = ({ data }: Props) => (
  <Link href="/users/[id]" as={`/users/${data.id}`}>
    <div className="h-full py-10 flex flex-col items-center justify-between">
      <img
        className="w-20"
        src="https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
      />
      <h1 className="text-md">id: {data.id}</h1>
      <h1 className="capitalize	text-lg">{data.name}</h1>
    </div>
  </Link>
);

export default ListItem;
