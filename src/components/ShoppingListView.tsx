import React, { useState } from 'react';
import {
  ShoppingCart,
  Copy,
  Check,
  Plus,
  Trash2,
  CheckCheck,
  FileCode,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ShoppingCategoryGroup, MealPlanDay } from '../types';

interface ShoppingListViewProps {
  categories: ShoppingCategoryGroup[];
  mealPlan?: MealPlanDay[];
  onToggleItem: (categoryId: string, itemId: string) => void;
  onAddItem: (category: string, text: string) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
  onClearChecked: () => void;
  onNavigateToMealPlan?: () => void;
}

export function ShoppingListView({
  categories,
  mealPlan = [],
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onClearChecked,
  onNavigateToMealPlan,
}: ShoppingListViewProps) {
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [copiedObsidian, setCopiedObsidian] = useState(false);

  const totalPlannedMeals = mealPlan.reduce(
    (acc, d) =>
      acc +
      (d.breakfast?.recipeTitle ? 1 : 0) +
      (d.lunch?.recipeTitle ? 1 : 0) +
      (d.dinner?.recipeTitle ? 1 : 0),
    0
  );

  const availableCategories = React.useMemo(() => {
    const existing = categories.map((c) => c.category);
    const defaults = [
      'Produce & Fresh Herbs',
      'Meat & Seafood',
      'Dairy & Eggs',
      'Pantry & Grains',
      'Spices & Baking',
      'Other',
    ];
    const combined = Array.from(new Set([...existing, ...defaults]));
    return combined;
  }, [categories]);

  const activeCategoryChoice = selectedCategory || availableCategories[0] || 'Produce & Fresh Herbs';

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedItems = categories.reduce(
    (acc, cat) => acc + cat.items.filter((i) => i.isChecked).length,
    0
  );

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(activeCategoryChoice, newItemText.trim());
    setNewItemText('');
  };

  const handleCopyObsidianMarkdown = () => {
    let md = `## 🛒 Grocery Shopping List\n\n`;
    categories.forEach((cat) => {
      if (cat.items.length > 0) {
        md += `### ${cat.category}\n`;
        cat.items.forEach((item) => {
          const check = item.isChecked ? '[x]' : '[ ]';
          md += `- ${check} ${item.text}\n`;
        });
        md += '\n';
      }
    });

    navigator.clipboard.writeText(md);
    setCopiedObsidian(true);
    setTimeout(() => setCopiedObsidian(false), 2500);
  };

  return (
    <div id="obsidian-shopping-list-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              <span>Smart Grocery &amp; Pantry List</span>
            </h2>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
              totalPlannedMeals > 0
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-white/5 text-gray-500 border-white/5'
            }`}>
              {totalPlannedMeals} {totalPlannedMeals === 1 ? 'meal on plan' : 'meals on plan'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {totalItems === 0
              ? 'Only ingredients for meals on your weekly meal plan are displayed here.'
              : `${checkedItems} of ${totalItems} items completed`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToMealPlan && (
            <button
              onClick={onNavigateToMealPlan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekly Planner</span>
            </button>
          )}

          {/* Copy as Obsidian Markdown */}
          <button
            id="copy-obsidian-checklist-btn"
            onClick={handleCopyObsidianMarkdown}
            disabled={totalItems === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
            title="Copy as Obsidian Markdown Checklist format"
          >
            {copiedObsidian ? <Check className="w-4 h-4 text-emerald-400" /> : <FileCode className="w-4 h-4 text-amber-400" />}
            <span>{copiedObsidian ? 'Copied Markdown!' : 'Copy for Obsidian'}</span>
          </button>

          {/* Clear Checked */}
          {checkedItems > 0 && (
            <button
              onClick={onClearChecked}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Clear Done</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddNewItem} className="flex flex-col sm:flex-row gap-2">
        <input
          id="new-grocery-item-input"
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add custom item (e.g. 2 ripe Avocados, Sea Salt)..."
          className="flex-1 text-xs bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-amber-500 shadow-xs"
        />
        <select
          value={activeCategoryChoice}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-gray-300 focus:outline-none focus:border-amber-500 max-w-xs truncate"
        >
          {availableCategories.map((cat) => (
            <option key={cat} value={cat} className="bg-[#141414]">
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="flex items-center justify-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Categorized Lists or Empty State */}
      {totalItems === 0 ? (
        <div className="bg-[#141414] rounded-2xl border border-dashed border-white/10 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-sm text-gray-200">
              {totalPlannedMeals === 0 ? 'Weekly Meal Plan is Empty' : 'Your shopping list is empty'}
            </h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              {totalPlannedMeals === 0
                ? 'The shopping list only displays ingredients when meals are scheduled on your weekly meal plan. Schedule meals in the planner to automatically generate your grocery list.'
                : 'All items have been completed or removed. Add more meals to your weekly meal plan or add custom items above.'}
            </p>
          </div>

          {onNavigateToMealPlan && (
            <button
              onClick={onNavigateToMealPlan}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Go to Weekly Meal Planner</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((group) => {
            if (group.items.length === 0) return null;

            return (
              <div
                key={group.category}
                className="bg-[#141414] rounded-2xl border border-white/10 p-4 shadow-xs space-y-2"
              >
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5 flex items-center justify-between">
                  <span>{group.category}</span>
                  <span className="text-[11px] font-normal text-gray-500">
                    {group.items.length} items
                  </span>
                </h3>

                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => onToggleItem(group.category, item.id)}
                      className={`flex items-center justify-between gap-3 p-2 rounded-lg cursor-pointer transition-colors group ${
                        item.isChecked
                          ? 'bg-white/5 text-gray-600 line-through'
                          : 'hover:bg-white/5 text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={item.isChecked}
                          onChange={() => {}}
                          className="rounded accent-amber-500 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm truncate">{item.text}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.recipeSources && item.recipeSources.length > 0 && (
                          <span className="text-[10px] font-mono text-gray-500 hidden sm:inline truncate max-w-xs">
                            {item.recipeSources.join(', ')}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(group.category, item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 p-1 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
