import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());                // ★ 꼭 필요
app.use(bodyParser.json());
app.use(express.static("public"));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/create", async (req, res) => {
    try {
        const userInput = req.body.input;
        if (!userInput) return res.status(400).json({ error: "input 필요함" });

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "블로그용 글을 작성하는 AI" },
                { role: "user", content: userInput }
            ]
        });

        const content = completion.choices[0].message.content;

        if (!fs.existsSync("posts")) fs.mkdirSync("posts");

        const filename = `${Date.now()}-${userInput}.md`;
        fs.writeFileSync(path.join("posts", filename), content);

        res.json({ ok: true, file: filename });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버오류" });
    }
});

app.listen(3001, () => console.log("Node server running on 3001"));
