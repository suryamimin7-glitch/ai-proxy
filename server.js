import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.get("/", (req, res) => {
  res.json({ ok: true, message: "AI Proxy aktif ✅" });
});

app.post("/v1/:path*", async (req, res) => {
  try {
    const url = `https://api.openai.com/v1/${req.params.path}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
