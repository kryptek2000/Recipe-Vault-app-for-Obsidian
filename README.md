# 🍳 Obsidian Vault Recipe Manager & Cooking Companion

A markdown-native recipe manager, meal planner, and interactive cooking companion built specifically for **Obsidian** vaults. Read, edit, sync, and cook directly from your Obsidian `.md` recipe collection with YAML frontmatter, Dataview tags, wikilinks, dynamic portion scaling, multi-step cooking timers, and AI-powered web recipe scraping.

---

## ✨ Features

### 📂 Native Obsidian Vault Synchronization
- **Direct Vault Connection**: Connect local Obsidian vault folders using the File System Access API (`showDirectoryPicker`) for direct reading and writing.
- **Drag-and-Drop Vault Importer**: Drag individual `.md` notes or entire vault folders to import and parse recipes instantly.
- **Bi-directional Compatibility**: Export, download, or copy standardized Obsidian Markdown files with YAML frontmatter, wikilinks (`[[Garlic]]`), Dataview tags, and callouts (`> [!tip]`).

### 🌐 AI Web Recipe Grabber
- **URL & Text Importer**: Paste any recipe website URL, raw HTML, or recipe text to convert it into a structured Obsidian markdown note.
- **Structured Schema & AI Parsing**: Extracts recipe metadata, ingredient amounts, wikilink entities, cooking step durations, and tips using Gemini AI and Schema.org JSON-LD extraction.

### 🍳 Distraction-Free Interactive Cooking Mode
- **Step-by-Step Focus**: Fullscreen hands-free cooking assistant with high-contrast typography.
- **Automatic Timer Detection**: Detects durations in instruction steps (e.g., *"Simmer for 15 minutes"*) with one-click countdown timers, background alerts, and celebration audio chimes.
- **Interactive Checklists**: Check off prepared ingredients and completed steps in real time.

### ⚖️ Dynamic Portion & Serving Scaling
- Scale recipes seamlessly from **0.5× to 4×** with intelligent fraction and measurement arithmetic (e.g., `1 1/2 cups` scales accurately to `3 cups`).
- Metric and Imperial unit support.

### 📊 Dual Layouts: Visual Grid & Dataview Table
- **Recipe Grid**: Rich card view displaying cook time, difficulty, calorie counts, and tag pills.
- **Dataview Table View**: Structured tabular view inspired by the Obsidian Dataview plugin, supporting multi-column sorting and filtering by cuisine, difficulty, total time, and tags.

### 📅 Weekly Meal Planner & Synchronized Grocery List
- **7-Day Meal Scheduler**: Organize Breakfast, Lunch, and Dinner slots across the week.
- **Smart Grocery List**: Automatically syncs ingredients from scheduled meals into categorized shopping checklists (Produce, Pantry, Dairy, Meat, etc.). When the meal plan is empty, the grocery list stays clean.
- **Obsidian Checklist Export**: One-click copy formatted Markdown task checklists (`- [ ]`) ready to paste into your Obsidian daily notes.

### 🎨 Obsidian Community Themes
- Switch between custom Obsidian themes:
  - **Obsidian Default Dark** (Classic Obsidian aesthetic)
  - **Minimalist Clean Light**
  - **Nord Frost** (Arctic blue tones)
  - **Dracula** (Vibrant purple & dark violet)
  - **Cyberpunk Neon** (High contrast glowing amber/cyan)
  - **Rosé Pine** (Cozy muted vintage tones)
  - **Solarized Dark**

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide React, Canvas Confetti
- **Markdown & Frontmatter**: `js-yaml`, `react-markdown`, `remark-gfm`
- **Backend API**: Express.js, TypeScript (`tsx`), Node.js
- **AI Integration**: Google Gen AI SDK (`@google/genai`) with Gemini 3.7 Flash for recipe extraction
- **Build System**: Vite 6, `esbuild`

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- *(Optional)* A [Google Gemini API Key](https://aistudio.google.com/) for the AI Web Recipe Grabber feature.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/obsidian-recipe-manager.git
   cd obsidian-recipe-manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key inside `.env`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

## 📝 Obsidian Recipe Markdown Format

Recipes in this manager follow standard Obsidian Markdown with YAML frontmatter:

```markdown
---
title: Creamy Tuscan Garlic Chicken
tags:
  - recipe
  - dinner
  - italian
  - high-protein
cuisine: Italian
category: Dinner
servings: 4
prep_time: 15 mins
cook_time: 25 mins
difficulty: Medium
calories: 520
source: "https://example.com/tuscan-chicken"
rating: 5
favorite: true
---

# Creamy Tuscan Garlic Chicken

> [!summary] Rich, restaurant-quality pan-seared chicken bathed in a velvety sun-dried tomato garlic sauce.

## 🛒 Ingredients

- [ ] 2 large [[Chicken Breast|chicken breasts]], sliced horizontally
- [ ] 1 tbsp [[Olive Oil]]
- [ ] 4 cloves [[Garlic]], minced
- [ ] 1/2 cup [[Heavy Cream]]
- [ ] 1/2 cup [[Chicken Broth]]
- [ ] 1/2 cup [[Sun-Dried Tomatoes]], chopped
- [ ] 2 cups [[Baby Spinach]]
- [ ] 1/2 cup [[Parmesan Cheese]], freshly grated

## 🔪 Instructions

1. Season chicken with salt, pepper, and Italian seasoning.
2. Heat olive oil in a skillet over medium-high heat. Sear chicken for 5 minutes per side until golden. Remove and set aside.
3. Add minced garlic to the pan and saute for 1 minute until fragrant.
4. Pour in chicken broth, heavy cream, and sun-dried tomatoes. Simmer for 3 minutes.
5. Add baby spinach and parmesan cheese; stir for 2 minutes until wilted.
6. Return chicken to skillet and simmer for 5 minutes until sauce thickens and chicken reaches 165°F.

> [!tip] Serve over warm fettuccine pasta or roasted garlic mashed potatoes.
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Express backend and Vite development server on port 3000 |
| `npm run build` | Builds the React frontend and bundles the Node server with `esbuild` |
| `npm run start` | Runs the production-bundled server (`dist/server.cjs`) |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Cleans up the `dist` build directory |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/obsidian-recipe-manager/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
