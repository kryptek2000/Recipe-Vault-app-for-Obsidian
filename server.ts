import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { grabRecipeFromWeb } from "./server/recipeGrabber.js";
import { recipeImportRateLimiter, getClientIp } from "./server/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with request size bounds
app.use(express.json({ limit: "2mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Recipe Grabber Web Importer endpoint with rate limiting & input validation
app.post("/api/grab-recipe", recipeImportRateLimiter, async (req, res) => {
  const clientIp = getClientIp(req);

  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        error: "Invalid request payload.",
      });
    }

    const { url, rawText, html } = req.body;

    // Validate URL field if provided
    let cleanUrl: string | undefined;
    if (url !== undefined && url !== null) {
      if (typeof url !== "string") {
        return res.status(400).json({ error: "URL parameter must be a string." });
      }
      const trimmedUrl = url.trim();
      if (trimmedUrl.length > 2048) {
        return res.status(400).json({ error: "URL exceeds maximum allowed length (2048 characters)." });
      }
      if (trimmedUrl.length > 0) {
        if (!/^https?:\/\//i.test(trimmedUrl)) {
          return res.status(400).json({ error: "Only HTTP and HTTPS URLs are supported." });
        }
        cleanUrl = trimmedUrl;
      }
    }

    // Validate rawText field if provided
    let cleanRawText: string | undefined;
    if (rawText !== undefined && rawText !== null) {
      if (typeof rawText !== "string") {
        return res.status(400).json({ error: "rawText parameter must be a string." });
      }
      const trimmedText = rawText.trim();
      if (trimmedText.length > 100000) {
        return res.status(400).json({ error: "Recipe text exceeds maximum allowed length (100,000 characters)." });
      }
      if (trimmedText.length > 0) {
        cleanRawText = trimmedText;
      }
    }

    // Validate html field if provided
    let cleanHtml: string | undefined;
    if (html !== undefined && html !== null) {
      if (typeof html !== "string") {
        return res.status(400).json({ error: "html parameter must be a string." });
      }
      const trimmedHtml = html.trim();
      if (trimmedHtml.length > 500000) {
        return res.status(400).json({ error: "HTML content exceeds maximum allowed length (500,000 characters)." });
      }
      if (trimmedHtml.length > 0) {
        cleanHtml = trimmedHtml;
      }
    }

    if (!cleanUrl && !cleanRawText && !cleanHtml) {
      return res.status(400).json({
        error: "Please provide a valid website URL or recipe text to import.",
      });
    }

    const recipe = await grabRecipeFromWeb({
      url: cleanUrl,
      rawText: cleanRawText,
      html: cleanHtml,
    });

    return res.json({ success: true, recipe });
  } catch (error: any) {
    const errorMsg = error?.message || "";
    console.error(`[${new Date().toISOString()}] [Client: ${clientIp}] Recipe Import Error:`, error);

    // Return safe, user-friendly error messages without leaking internal topology
    if (
      errorMsg.includes("restricted") ||
      errorMsg.includes("permitted") ||
      errorMsg.includes("Invalid URL") ||
      errorMsg.includes("credentials") ||
      errorMsg.includes("resolve")
    ) {
      return res.status(400).json({
        error: "The provided URL is invalid or cannot be fetched.",
      });
    }

    if (errorMsg.includes("timed out") || errorMsg.includes("8s limit")) {
      return res.status(504).json({
        error: "The recipe website took too long to respond. Please try pasting the recipe text directly.",
      });
    }

    if (errorMsg.includes("2MB limit") || errorMsg.includes("size exceeds")) {
      return res.status(413).json({
        error: "The target website response is too large to process.",
      });
    }

    return res.status(500).json({
      error: "Failed to extract recipe from the provided source. Please verify the URL or paste the recipe text directly.",
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
