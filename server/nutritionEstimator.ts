import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

export interface NutritionEstimateRequest {
  title?: string;
  servings?: number;
  ingredients: Array<string | { original?: string; amount?: number | null; unit?: string; name?: string }>;
}

export interface NutritionEstimateResult {
  calories: number; // kcal per serving
  protein: number; // g per serving
  carbohydrates: number; // g per serving
  fat: number; // g per serving
  fiber: number; // g per serving
  sodium: number; // mg per serving
  confidenceNote: string;
}

/**
 * Fallback algorithmic culinary nutritional estimator based on standard ingredient profiles
 */
function estimateAlgorithmicNutrition(
  recipeTitle: string,
  servings: number,
  ingredientLines: string[]
): NutritionEstimateResult {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSodium = 0;

  for (const line of ingredientLines) {
    const lower = line.toLowerCase();
    
    // Extract numerical amount if present
    const amountMatch = lower.match(/(\d+(?:\.\d+)?|\d+\s*\/\s*\d+)/);
    let amount = 1;
    if (amountMatch) {
      const rawNum = amountMatch[1];
      if (rawNum.includes('/')) {
        const parts = rawNum.split('/');
        amount = parseFloat(parts[0]) / parseFloat(parts[1]);
      } else {
        amount = parseFloat(rawNum);
      }
    }

    if (lower.includes('pasta') || lower.includes('spaghetti') || lower.includes('rigatoni') || lower.includes('noodle') || lower.includes('rice') || lower.includes('flour')) {
      const multiplier = lower.includes('lb') || lower.includes('pound') ? amount * 450 : lower.includes('g') ? amount : amount * 100;
      totalCalories += (multiplier / 100) * 360;
      totalProtein += (multiplier / 100) * 12;
      totalCarbs += (multiplier / 100) * 75;
      totalFat += (multiplier / 100) * 2;
      totalFiber += (multiplier / 100) * 3;
      totalSodium += (multiplier / 100) * 5;
    } else if (lower.includes('guanciale') || lower.includes('pancetta') || lower.includes('bacon') || lower.includes('pork') || lower.includes('beef') || lower.includes('steak')) {
      const multiplier = lower.includes('g') ? amount : lower.includes('oz') ? amount * 28.3 : lower.includes('lb') ? amount * 450 : amount * 50;
      totalCalories += (multiplier / 100) * 600;
      totalProtein += (multiplier / 100) * 15;
      totalFat += (multiplier / 100) * 60;
      totalSodium += (multiplier / 100) * 1200;
    } else if (lower.includes('egg yolk') || lower.includes('yolk')) {
      totalCalories += amount * 55;
      totalProtein += amount * 2.7;
      totalFat += amount * 4.5;
      totalSodium += amount * 8;
    } else if (lower.includes('egg')) {
      totalCalories += amount * 72;
      totalProtein += amount * 6.3;
      totalFat += amount * 4.8;
      totalSodium += amount * 71;
    } else if (lower.includes('pecorino') || lower.includes('parmesan') || lower.includes('cheese') || lower.includes('cheddar') || lower.includes('mozzarella')) {
      const multiplier = lower.includes('cup') ? amount * 100 : lower.includes('g') ? amount : lower.includes('oz') ? amount * 28.3 : amount * 30;
      totalCalories += (multiplier / 100) * 390;
      totalProtein += (multiplier / 100) * 32;
      totalFat += (multiplier / 100) * 28;
      totalSodium += (multiplier / 100) * 1800;
    } else if (lower.includes('oil') || lower.includes('butter')) {
      const multiplier = lower.includes('tbsp') ? amount * 14 : lower.includes('tsp') ? amount * 5 : lower.includes('cup') ? amount * 220 : amount * 14;
      totalCalories += (multiplier / 14) * 120;
      totalFat += (multiplier / 14) * 14;
    } else if (lower.includes('salt')) {
      totalSodium += (lower.includes('tsp') ? amount * 2300 : 300);
    } else if (lower.includes('sugar') || lower.includes('honey')) {
      const multiplier = lower.includes('tbsp') ? amount * 15 : lower.includes('cup') ? amount * 200 : amount * 15;
      totalCalories += (multiplier / 15) * 60;
      totalCarbs += (multiplier / 15) * 15;
    } else {
      // General vegetable, spice, broth, condiment baseline
      totalCalories += 25;
      totalCarbs += 4;
      totalProtein += 1;
      totalFiber += 1;
      totalSodium += 50;
    }
  }

  // Ensure reasonable baseline if ingredients provided
  if (totalCalories < 100 * servings) {
    totalCalories = 450 * servings;
    totalProtein = 18 * servings;
    totalCarbs = 45 * servings;
    totalFat = 15 * servings;
    totalFiber = 3 * servings;
    totalSodium = 600 * servings;
  }

  const s = Math.max(1, servings);
  return {
    calories: Math.max(0, Math.round(totalCalories / s)),
    protein: Math.max(0, Math.round((totalProtein / s) * 10) / 10),
    carbohydrates: Math.max(0, Math.round((totalCarbs / s) * 10) / 10),
    fat: Math.max(0, Math.round((totalFat / s) * 10) / 10),
    fiber: Math.max(0, Math.round((totalFiber / s) * 10) / 10),
    sodium: Math.max(0, Math.round(totalSodium / s)),
    confidenceNote: `Nutrition values are estimated based on ${ingredientLines.length} ingredients across ${s} servings.`
  };
}

/**
 * Estimates macronutrients and micronutrients per serving using Gemini AI
 */
export async function estimateRecipeNutrition(
  req: NutritionEstimateRequest
): Promise<NutritionEstimateResult> {
  const recipeTitle = req.title ? req.title.trim().slice(0, 200) : "Culinary Recipe";
  const servings = Math.max(1, Math.min(100, Number(req.servings) || 4));

  if (!req.ingredients || !Array.isArray(req.ingredients) || req.ingredients.length === 0) {
    throw new Error("Please provide a list of ingredients to estimate nutrition.");
  }

  // Format ingredients list cleanly for the prompt
  const ingredientLines: string[] = [];
  for (let i = 0; i < Math.min(req.ingredients.length, 100); i++) {
    const item = req.ingredients[i];
    if (typeof item === "string") {
      const trimmed = item.trim().slice(0, 300);
      if (trimmed) ingredientLines.push(`- ${trimmed}`);
    } else if (item && typeof item === "object") {
      const line = item.original || `${item.amount || ''} ${item.unit || ''} ${item.name || ''}`.trim();
      const trimmed = line.trim().slice(0, 300);
      if (trimmed) ingredientLines.push(`- ${trimmed}`);
    }
  }

  if (ingredientLines.length === 0) {
    throw new Error("No valid ingredient lines were provided.");
  }

  const gemini = getGemini();
  if (!gemini) {
    return estimateAlgorithmicNutrition(recipeTitle, servings, ingredientLines);
  }

  try {
    const prompt = `You are a certified culinary nutritional analysis engine for The Kitchen Codex.
Analyze the following recipe and its ingredients to calculate the estimated nutritional content PER SERVING (divided among ${servings} servings total).

Recipe Title: ${recipeTitle}
Total Servings: ${servings}

Ingredients:
${ingredientLines.join("\n")}

Guidelines:
1. Calculate per-serving values (divide total recipe batch nutrition by ${servings}).
2. Account for cooking methods and typical absorption (e.g. oil used in cooking).
3. If an ingredient has "to taste" or unstated amount (e.g., salt, pepper), assume standard modest culinary pinches.
4. Output strictly the requested JSON structure with integers/decimals rounded to 1 decimal place (calories as whole integer).
5. Provide a brief, factual confidence note (e.g. "Nutrition values are estimates based on ${ingredientLines.length} ingredients across ${servings} servings.").`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            calories: {
              type: Type.NUMBER,
              description: "Estimated calories per serving in kcal (integer)",
            },
            protein: {
              type: Type.NUMBER,
              description: "Estimated protein per serving in grams",
            },
            carbohydrates: {
              type: Type.NUMBER,
              description: "Estimated total carbohydrates per serving in grams",
            },
            fat: {
              type: Type.NUMBER,
              description: "Estimated total fat per serving in grams",
            },
            fiber: {
              type: Type.NUMBER,
              description: "Estimated dietary fiber per serving in grams",
            },
            sodium: {
              type: Type.NUMBER,
              description: "Estimated sodium per serving in milligrams",
            },
            confidenceNote: {
              type: Type.STRING,
              description: "A short qualification message regarding the estimation",
            },
          },
          required: [
            "calories",
            "protein",
            "carbohydrates",
            "fat",
            "fiber",
            "sodium",
          ],
        },
      },
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      return estimateAlgorithmicNutrition(recipeTitle, servings, ingredientLines);
    }

    const parsed = JSON.parse(responseText);
    const calories = Math.max(0, Math.round(Number(parsed.calories) || 0));
    const protein = Math.max(0, Math.round((Number(parsed.protein) || 0) * 10) / 10);
    const carbohydrates = Math.max(0, Math.round((Number(parsed.carbohydrates) || 0) * 10) / 10);
    const fat = Math.max(0, Math.round((Number(parsed.fat) || 0) * 10) / 10);
    const fiber = Math.max(0, Math.round((Number(parsed.fiber) || 0) * 10) / 10);
    const sodium = Math.max(0, Math.round(Number(parsed.sodium) || 0));
    const confidenceNote =
      typeof parsed.confidenceNote === "string" && parsed.confidenceNote.trim()
        ? parsed.confidenceNote.trim()
        : `Nutrition values are estimates based on ${ingredientLines.length} ingredients across ${servings} servings.`;

    return {
      calories,
      protein,
      carbohydrates,
      fat,
      fiber,
      sodium,
      confidenceNote,
    };
  } catch (err) {
    console.warn("AI nutrition estimation fallback engaged:", err);
    return estimateAlgorithmicNutrition(recipeTitle, servings, ingredientLines);
  }
}
