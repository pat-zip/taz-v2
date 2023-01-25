import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://uujmgngrxsokgjikjiuk.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { node } = req.body;
    console.log(req.body);
    await supabase.from("nodes").update({ isCleared: true }).eq("id", node);

    res.status(201).json("Node updated");
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
