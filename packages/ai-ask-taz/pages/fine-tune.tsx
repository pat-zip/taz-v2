import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import styles from "../styles/Home.module.css";
import { v4 as uuidv4 } from "uuid";

const FineTune = () => {
  const [inputFields, setInputFields] = useState([
    { id: uuidv4(), prompt: "", completion: "" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("InputFields", inputFields);
  };

  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });

    setInputFields(newInputFields);
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      { id: uuidv4(), prompt: "", completion: "" },
    ]);
  };

  const handleRemoveFields = (id) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
  };

  return (
    <div className={styles.container}>
      <div className="mt-10">
        <Sidebar />
        <div className="bg-white p-4 lg:col-span-1 text-center">
          <h1 className="text-2xl font-medium">Fine-Tune</h1>
          <p className="text-lg mb-5">
            Improve the fine-tune model by providing additional prompts and
            expected completions.
          </p>
          <form onSubmit={handleSubmit} className="mx-auto w-1/4">
            {inputFields.map((inputField) => (
              <div key={inputField.id} className="flex items-center mb-3">
                <input
                  className="border-2 border-gray-300 bg-white p-2 rounded-lg mr-4"
                  name="prompt"
                  placeholder="Prompt"
                  value={inputField.prompt}
                  onChange={(event) => handleChangeInput(inputField.id, event)}
                />
                <input
                  className="border-2 border-gray-300 bg-white p-2 rounded-lg mr-4"
                  name="completion"
                  placeholder="Completion"
                  value={inputField.completion}
                  onChange={(event) => handleChangeInput(inputField.id, event)}
                />
                <button
                  className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  disabled={inputFields.length === 1}
                  onClick={() => handleRemoveFields(inputField.id)}
                >
                  -
                </button>
              </div>
            ))}
            <button
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4"
              onClick={handleAddFields}
            >
              +
            </button>
            <button
              className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded ml-4"
              type="submit"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FineTune;
