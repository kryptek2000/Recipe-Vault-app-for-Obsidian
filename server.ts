import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { grabRecipeFromWeb } from "./server/recipeGrabber.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Recipe Grabber Web Importer endpoint
app.post("/api/grab-recipe", async (req, res) => {
  try {
    const { url, rawText, html } = req.body;

    if (!url && !rawText && !html) {
      return res.status(400).json({
        error: "Please provide a website URL or recipe text/HTML to grab.",
      });
    }

    const recipe = await grabRecipeFromWeb({ url, rawText, html });
    return res.json({ success: true, recipe });
  } catch (error: any) {
    console.error("Recipe Grabber API Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to grab recipe from the provided source.",
    });
  }
});

// Serve frontend with Vite in dev, static files in prod
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Obsidian Vault Recipe Server running on http://localhost:${PORT}`);
  });
}

start();
