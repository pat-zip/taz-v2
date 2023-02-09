import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://uujmgngrxsokgjikjiuk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1am1nbmdyeHNva2dqaWtqaXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NDQ0MDEzNiwiZXhwIjoxOTkwMDE2MTM2fQ.SW9s71kEn-8Aqb9AS7WR-YplMe2DeNFJS0PgzrDQxLI";
const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { node } = req.body;
    const response = await supabase
      .from("nodes")
      .select(
        `title, description, question, image, hasChallenge, isCleared, challengeType, stat, modifier, edges (id, action, next), monsters (name, health, damage, image)`
      )
      .eq("id", node);

    console.log(response.data[0].monsters);

    res.status(200).json(response.data[0]);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
