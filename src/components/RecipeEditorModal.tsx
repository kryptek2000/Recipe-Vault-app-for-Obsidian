import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  FileCode,
  FileText,
  Plus,
  Trash2,
  Download,
  Check,
  Sparkles,
  Tag,
  Clock,
  Flame,
  Users,
} from 'lucide-react';
import { ObsidianRecipe, ParsedIngredient, RecipeStep } from '../types';
import {
  parseObsidianRecipeMarkdown,
  serializeRecipeToObsidianMarkdown,
} from '../utils/markdownParser';

interface RecipeEditorModalProps {
  initialRecipe?: ObsidianRecipe | null;
  onSave: (recipe: ObsidianRecipe) => void;
  onClose: () => void;
}

export function RecipeEditorModal({
  initialRecipe,
  onSave,
  onClose,
}: RecipeEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'markdown'>('visual');

  // Form State
  const [title, setTitle] = useState(initialRecipe?.title || '');
  const [fileName, setFileName] = useState(initialRecipe?.fileName || 'New Recipe.md');
  const [tagsInput, setTagsInput] = useState(initialRecipe?.tags?.join(', ') || 'food/recipes, dinner');
  const [cuisine, setCuisine] = useState(initialRecipe?.cuisine || '');
  const [category, setCategory] = useState(initialRecipe?.category || '');
  const [prepTime, setPrepTime] = useState(initialRecipe?.prepTime || '');
  const [cookTime, setCookTime] = useState(initialRecipe?.cookTime || '');
  const [servings, setServings] = useState<string | number>(
    initialRecipe?.servings !== undefined ? initialRecipe.servings : ''
  );
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(
    initialRecipe?.difficulty || 'Easy'
  );
  const [rating, setRating] = useState(initialRecipe?.rating || 5);
  const [calories, setCalories] = useState(initialRecipe?.calories?.toString() || '');
  const [protein, setProtein] = useState<string>(initialRecipe?.nutrition?.protein?.toString() || '');
  const [carbs, setCarbs] = useState<string>(initialRecipe?.nutrition?.carbohydrates?.toString() || '');
  const [fat, setFat] = useState<string>(initialRecipe?.nutrition?.fat?.toString() || '');
  const [fiber, setFiber] = useState<string>(initialRecipe?.nutrition?.fiber?.toString() || '');
  const [sodium, setSodium] = useState<string>(initialRecipe?.nutrition?.sodium?.toString() || '');
  const [image, setImage] = useState(initialRecipe?.image || '');
  const [isEstimatingNutrition, setIsEstimatingNutrition] = useState(false);
  const [nutritionError, setNutritionError] = useState<string | null>(null);
  const [nutritionSuccess, setNutritionSuccess] = useState(false);

  // Callout
  const [calloutTitle, setCalloutTitle] = useState(
    initialRecipe?.callouts?.[0]?.title || "Chef's Tip"
  );
  const [calloutContent, setCalloutContent] = useState(
    initialRecipe?.callouts?.[0]?.content || ''
  );

  // Ingredients text (line by line)
  const [ingredientsText, setIngredientsText] = useState(
    initialRecipe?.ingredients
      ?.map((i) => i.original)
      .join('\n') || ''
  );

  // Instructions text (numbered or step by step)
  const [instructionsText, setInstructionsText] = useState(
    initialRecipe?.instructions
      ?.map((step) => `${step.stepNumber}. ${step.text}`)
      .join('\n') || ''
  );

  const [notes, setNotes] = useState(initialRecipe?.notes || '');

  // Raw Markdown buffer
  const [rawMarkdown, setRawMarkdown] = useState(initialRecipe?.rawMarkdown || '');

  // Keep markdown synced when switching to markdown tab
  useEffect(() => {
    if (activeTab === 'markdown') {
      const generated = generateCurrentMarkdown();
      setRawMarkdown(generated);
    }
  }, [activeTab]);

  const generateCurrentMarkdown = (): string => {
    const tags = tagsInput.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
    const parsedIngs: ParsedIngredient[] = ingredientsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => ({
        original: l,
        name: l.replace(/^[-*+]\s*(\[[ xX]\]\s*)?/, ''),
      }));

    const parsedSteps: RecipeStep[] = instructionsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l, idx) => ({
        stepNumber: idx + 1,
        text: l.replace(/^\d+\.\s*/, ''),
      }));

    const parsedServings = typeof servings === 'number' ? servings : parseInt(String(servings), 10);

    const parsedProtein = protein.trim() ? parseFloat(protein.trim()) : undefined;
    const parsedCarbs = carbs.trim() ? parseFloat(carbs.trim()) : undefined;
    const parsedFat = fat.trim() ? parseFloat(fat.trim()) : undefined;
    const parsedFiber = fiber.trim() ? parseFloat(fiber.trim()) : undefined;
    const parsedSodium = sodium.trim() ? parseFloat(sodium.trim()) : undefined;
    const parsedCalNum = calories.trim() ? parseInt(calories.trim().replace(/\D/g, ''), 10) : undefined;

    const hasNutrition = parsedCalNum || parsedProtein || parsedCarbs || parsedFat || parsedFiber || parsedSodium;

    const partial: Partial<ObsidianRecipe> = {
      title: title || 'Untitled Recipe',
      tags: tags.length > 0 ? tags : ['food/recipes'],
      cuisine: cuisine || 'General',
      category: category || 'Main Course',
      prepTime: prepTime.trim() || undefined,
      cookTime: cookTime.trim() || undefined,
      servings: !isNaN(parsedServings) && parsedServings > 0 ? parsedServings : undefined,
      difficulty,
      rating,
      calories: calories.trim() || (parsedCalNum ? parsedCalNum.toString() : undefined),
      nutrition: hasNutrition
        ? {
            calories: parsedCalNum,
            protein: parsedProtein,
            carbohydrates: parsedCarbs,
            fat: parsedFat,
            fiber: parsedFiber,
            sodium: parsedSodium,
          }
        : undefined,
      image: image || undefined,
      callouts: calloutContent ? [{ type: 'tip', title: calloutTitle, content: calloutContent }] : [],
      ingredients: parsedIngs,
      instructions: parsedSteps,
      notes: notes || undefined,
    };

    return serializeRecipeToObsidianMarkdown(partial);
  };

  const handleEstimateNutrition = async () => {
    setIsEstimatingNutrition(true);
    setNutritionError(null);
    setNutritionSuccess(false);

    try {
      const lines = ingredientsText
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        throw new Error('Please add ingredients before estimating nutrition.');
      }

      const numServings = typeof servings === 'number' ? servings : parseInt(String(servings), 10) || 4;

      const res = await fetch('/api/estimate-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'Recipe',
          servings: numServings,
          ingredients: lines,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to estimate nutrition.');
      }

      if (data.nutrition) {
        if (data.nutrition.calories !== undefined) setCalories(data.nutrition.calories.toString());
        if (data.nutrition.protein !== undefined) setProtein(data.nutrition.protein.toString());
        if (data.nutrition.carbohydrates !== undefined) setCarbs(data.nutrition.carbohydrates.toString());
        if (data.nutrition.fat !== undefined) setFat(data.nutrition.fat.toString());
        if (data.nutrition.fiber !== undefined) setFiber(data.nutrition.fiber.toString());
        if (data.nutrition.sodium !== undefined) setSodium(data.nutrition.sodium.toString());
        setNutritionSuccess(true);
        setTimeout(() => setNutritionSuccess(false), 3000);
      }
    } catch (err: any) {
      setNutritionError(err.message || 'Error estimating nutrition.');
    } finally {
      setIsEstimatingNutrition(false);
    }
  };

  const handleSave = () => {
    let finalRecipe: ObsidianRecipe;

    if (activeTab === 'markdown') {
      finalRecipe = parseObsidianRecipeMarkdown(
        rawMarkdown,
        fileName.endsWith('.md') ? fileName : `${fileName}.md`,
        initialRecipe?.filePath || `6 - Full Notes/Food/Recipes/${fileName}`
      );
    } else {
      const md = generateCurrentMarkdown();
      const safeName = fileName.endsWith('.md') ? fileName : `${(title || 'New Recipe').replace(/[\/\\?%*:|"<>]/g, '-')}.md`;
      finalRecipe = parseObsidianRecipeMarkdown(
        md,
        safeName,
        initialRecipe?.filePath || `Recipes/${safeName}`
      );
    }

    if (initialRecipe?.id) {
      finalRecipe.id = initialRecipe.id;
    }
    if (initialRecipe?.fileHandle) {
      finalRecipe.fileHandle = initialRecipe.fileHandle;
    }

    onSave(finalRecipe);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#141414] rounded-2xl border border-white/10 max-w-3xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-auto max-h-[92vh] flex flex-col text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white">
                {initialRecipe ? `Edit: ${initialRecipe.title}` : 'Create New Obsidian Recipe Note'}
              </h2>
              <span className="text-xs text-gray-500 font-mono">
                Recipes/{fileName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex bg-[#0C0C0C] p-1 rounded-lg border border-white/5 text-xs">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeTab === 'visual'
                    ? 'bg-white/10 text-amber-400 border border-white/10 shadow-xs font-semibold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Visual Editor
              </button>
              <button
                onClick={() => setActiveTab('markdown')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeTab === 'markdown'
                    ? 'bg-white/10 text-amber-400 border border-white/10 shadow-xs font-semibold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Raw .md
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          {activeTab === 'markdown' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Direct Obsidian Markdown &amp; Frontmatter</span>
                <span className="font-mono text-[11px] text-amber-400">YAML + Wikilinks [[...]]</span>
              </div>
              <textarea
                id="raw-markdown-editor"
                value={rawMarkdown}
                onChange={(e) => setRawMarkdown(e.target.value)}
                rows={18}
                className="w-full font-mono text-xs p-3.5 bg-[#0C0C0C] text-gray-200 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500 selection:bg-amber-500/30 selection:text-amber-200"
                placeholder="---\ntitle: ...\n---\n# Recipe Title..."
              />
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Title & File Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-300 mb-1">
                    Recipe Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!initialRecipe) {
                        setFileName(`${e.target.value.replace(/[\/\\?%*:|"<>]/g, '-')}.md`);
                      }
                    }}
                    placeholder="e.g. Sourdough Rosemary Focaccia"
                    className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-white font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-300 mb-1">
                    Obsidian File Name
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. Sourdough Focaccia.md"
                    className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 font-mono text-gray-300 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Frontmatter row 1: Tags, Cuisine, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-gray-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="food/recipes, dinner, italian"
                    className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 font-mono text-gray-300 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-300 mb-1">
                    Cuisine
                  </label>
                  <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="Italian, Japanese, etc."
                    className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-gray-300 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Main Course, Baking, Soup"
                    className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-gray-300 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Frontmatter row 2: Prep, Cook, Servings, Calories, Difficulty */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block font-medium text-gray-300 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="e.g. 15 mins"
                    className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-gray-300 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-300 mb-1">Cook Time</label>
                  <input
                    type="text"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    placeholder="e.g. 30 mins"
                    className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-gray-300 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-300 mb-1">Servings</label>
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    min={1}
                    placeholder="e.g. 4"
                    className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-gray-300 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-300 mb-1">Calories (kcal)</label>
                  <input
                    type="text"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g. 520"
                    className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-gray-300 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-300 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-gray-300 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Nutrition & Macros Breakdown Box */}
              <div className="p-3.5 rounded-xl bg-[#0F0F0F] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Nutrition &amp; Macros (per serving)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleEstimateNutrition}
                    disabled={isEstimatingNutrition}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isEstimatingNutrition ? 'animate-spin' : ''}`} />
                    <span>{isEstimatingNutrition ? 'Analyzing Ingredients...' : 'Estimate Nutrition (AI)'}</span>
                  </button>
                </div>

                {nutritionError && (
                  <p className="text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
                    {nutritionError}
                  </p>
                )}
                {nutritionSuccess && (
                  <p className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
                    Nutrition &amp; macros successfully estimated and populated!
                  </p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Protein (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      placeholder="e.g. 32"
                      className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-emerald-400 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      placeholder="e.g. 45"
                      className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-blue-400 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Fat (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      placeholder="e.g. 18"
                      className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-amber-400 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Fiber (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={fiber}
                      onChange={(e) => setFiber(e.target.value)}
                      placeholder="e.g. 6"
                      className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-purple-400 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Sodium (mg)</label>
                    <input
                      type="number"
                      value={sodium}
                      onChange={(e) => setSodium(e.target.value)}
                      placeholder="e.g. 580"
                      className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-orange-400 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Recipe Cover Image URL */}
              <div>
                <label className="block font-medium text-gray-300 mb-1">
                  Recipe Image URL (or leave empty for automatic keyword photography)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or custom food photo URL"
                    className="flex-1 bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-gray-300 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                  {image && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/15 shrink-0 bg-black">
                      <img
                        src={image}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Obsidian Callout Box */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Obsidian Callout &gt; [!tip]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={calloutTitle}
                    onChange={(e) => setCalloutTitle(e.target.value)}
                    placeholder="Callout Title (e.g. Chef's Tip)"
                    className="bg-[#0C0C0C] border border-white/10 rounded-lg p-1.5 text-white font-medium focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={calloutContent}
                    onChange={(e) => setCalloutContent(e.target.value)}
                    placeholder="Callout content or secret..."
                    className="sm:col-span-2 bg-[#0C0C0C] border border-white/10 rounded-lg p-1.5 text-gray-300 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Ingredients Textarea with Wikilink support */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-gray-300">
                    Ingredients (one per line, supports [[Wikilinks]])
                  </label>
                  <span className="text-[11px] text-amber-400 font-mono">
                    - [ ] amount unit [[Ingredient]]
                  </span>
                </div>
                <textarea
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  rows={5}
                  className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2.5 font-mono text-gray-300 focus:border-amber-500 focus:outline-none"
                  placeholder="- [ ] 2 tbsp [[Olive Oil]]\n- [ ] 3 cloves [[Garlic]]"
                />
              </div>

              {/* Instructions Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-gray-300">
                    Instructions (one step per line)
                  </label>
                  <span className="text-[11px] text-gray-500">
                    Mention durations like &quot;bake for 20 mins&quot; for auto-timers
                  </span>
                </div>
                <textarea
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  rows={5}
                  className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2.5 text-gray-300 focus:border-amber-500 focus:outline-none"
                  placeholder="1. Prep ingredients.\n2. Sauté for 5 minutes."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-medium text-gray-300 mb-1">
                  Notes, Pairings &amp; Variations
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0C0C0C] border border-white/10 rounded-lg p-2 text-gray-300 focus:border-amber-500 focus:outline-none"
                  placeholder="Storage tips, wine pairings..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>

          <button
            id="save-recipe-modal-btn"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md shadow-amber-500/20 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Obsidian Note</span>
          </button>
        </div>
      </div>
    </div>
  );
}
