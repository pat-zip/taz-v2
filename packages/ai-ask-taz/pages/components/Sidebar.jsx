import React, { useState } from "react";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState("Semaphore");

  Sidebar.selectedModel = selectedModel;

  return (
    <div className="bg-gray-800 h-screen w-64 fixed top-0 left-0">
      <nav className="flex flex-col h-full">
        <div className="p-4 text-white">
          <p className="text-lg font-medium">
            <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
              Ask ZK protocols
            </button>
          </p>
          {isOpen && (
            <div className="p-4">
              <Link href="/" onClick={() => setSelectedModel("Semaphore")}>
                <p className="block py-2 pl-2 ml-2 text-base font-medium text-white hover:bg-gray-700">
                  Semaphore
                </p>
              </Link>
              <Link href="/" onClick={() => setSelectedModel("UniRep")}>
                <p className="block py-2 pl-2 ml-2 text-base font-medium text-white hover:bg-gray-700">
                  UniRep
                </p>
              </Link>
            </div>
          )}
        </div>
        <div className="p-4">
          <Link href="/fine-tune">
            <p className="block py-2 pl-2 ml-2 text-base  font-medium text-white hover:bg-gray-700">
              Train me
            </p>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
