import React from "react";

const { Configuration, OpenAIApi } = require("openai");

export const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const MyComponent = () => {
  return;
};

export default MyComponent;
