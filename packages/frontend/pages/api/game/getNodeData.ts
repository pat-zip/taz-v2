import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://uujmgngrxsokgjikjiuk.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { node } = req.body;
    const response = await supabase
      .from("nodes")
      .select(
        `title, description, question, image, hasChallenge, isCleared, challengeType, edges (id, action, next), monsters (name, health, damage, image)`
      )
      .eq("id", node);

    res.status(200).json(response.data[0]);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
