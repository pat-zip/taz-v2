import * as React from "react";

type Props = {
  search: string;
  setSearch: (input: string) => void;
};

const Input = ({ search, setSearch }: Props) => {
  return (
    <div className="relative text-gray-600  w-full my-20">
      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
        <button
          type="submit"
          className="p-1 focus:outline-none focus:shadow-outline"
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
      </span>
      <input
        className="w-full py-4  rounded-md pl-10 focus:outline-none bg-gray-900 text-white"
        placeholder="Search Users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default Input;
