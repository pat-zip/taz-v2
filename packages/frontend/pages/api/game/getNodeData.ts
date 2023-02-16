import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://uujmgngrxsokgjikjiuk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1am1nbmdyeHNva2dqaWtqaXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NDQ0MDEzNiwiZXhwIjoxOTkwMDE2MTM2fQ.SW9s71kEn-8Aqb9AS7WR-YplMe2DeNFJS0PgzrDQxLI";
const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("triggered")
  try {
    const { node } = req.body;
    const response = await supabase
      .from("nodes")
      .select(
        `id, title, description, question, image, hasChallenge, challengeType, stat, modifier, edges (id, action, next), monsters (name), stat_checks (id, treshold, success, fail, stat, next)`
      )
      .eq("id", node);

    console.log("Data: ", response.data);

    res.status(200).json(response.data[0]);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
