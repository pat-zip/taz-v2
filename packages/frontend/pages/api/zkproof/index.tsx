import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { file },
  } = req;

  const filePath = `./${file}`;

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end(`File not found`);
    } else {
      //   res.setHeader('Content-Type', 'application/wasm');
      res.end(data);
    }
  });
};
