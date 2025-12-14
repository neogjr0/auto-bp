import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/create", async (req, res) => {
  try {
    const userInput = req.body.input;
    if (!userInput) {
      return res.status(400).json({ error: "input 필요함" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "블로그용 글을 작성하는 AI" },
        { role: "user", content: userInput },
      ],
    });

    const content =
      completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI 응답 비어있음");
    }

    const POSTS_DIR = path.join(process.cwd(), "posts");
    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
    }

    const filename = `${Date.now()}.md`;
    fs.writeFileSync(path.join(POSTS_DIR, filename), content);

    res.json({ ok: true, file: filename });
  } catch (err) {
    console.error("🔥 CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Node server running on 3001");
});
