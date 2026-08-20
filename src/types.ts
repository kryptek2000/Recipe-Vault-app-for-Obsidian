export interface ParsedIngredient {
  original: string;
  amount?: number | null;
  unit?: string;
  name: string;
  wikilink?: string;
  note?: string;
  isChecked?: boolean;
}

export interface RecipeStep {
  stepNumber: number;
  text: string;
  timerMinutes?: number | null;
  isCompleted?: boolean;
}

export interface ObsidianCallout {
  type: 'tip' | 'warning' | 'info' | 'note' | 'quote' | 'important';
  title?: string;
  content: string;
}

export interface ObsidianRecipe {
  id: string;
  fileName: string;
  filePath: string;
  rawMarkdown: string;
  title: string;
  tags: string[];
  category: string;
  cuisine: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number; // 1-5
  calories?: string | number;
  source?: string;
  image?: string;
  ingredients: ParsedIngredient[];
  instructions: RecipeStep[];
  notes?: string;
  callouts: ObsidianCallout[];
  dataviewFields: Record<string, string>;
  wikilinks: string[];
  lastModified?: string;
  fileHandle?: any; // Native FileSystemFileHandle if connected
  isFavorite?: boolean;
}

export interface MealPlanSlot {
  recipeId?: string;
  recipeTitle?: string;
  customText?: string;
}

export interface MealPlanDay {
  dayName: string; // 'Monday', 'Tuesday', etc.
  dateStr?: string;
  breakfast?: MealPlanSlot;
  lunch?: MealPlanSlot;
  dinner?: MealPlanSlot;
  snacks?: MealPlanSlot[];
}

export interface VaultSyncStatus {
  isConnected: boolean;
  vaultPath: string;
  fileCount: number;
  lastSynced?: string;
  accessType: 'filesystem_api' | 'drag_drop' | 'uploaded_folder' | 'starter_vault';
  folderHandle?: any;
}

export interface FilterState {
  search: string;
  tag: string | null;
  category: string | null;
  cuisine: string | null;
  difficulty: string | null;
  maxCookTime: number | null;
  minRating: number | null;
  ingredientSearch: string;
  onlyFavorites: boolean;
  sortBy: 'title' | 'rating' | 'cookTime' | 'recent' | 'servings';
  sortOrder: 'asc' | 'desc';
}

export interface ActiveTimer {
  id: string;
  recipeTitle: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  createdAt: number;
}

export interface ShoppingCategoryGroup {
  category: string;
  items: {
    id: string;
    text: string;
    recipeSources: string[];
    isChecked: boolean;
  }[];
}

export type ThemeId = 'obsidian' | 'parchment' | 'nordic';

export interface AppThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  description: string;
  mode: 'dark' | 'light';
  palette: {
    bgRoot: string;
    bgSurface: string;
    bgElevated: string;
    accent: string;
    accentSecondary: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
  highlights: string[];
  vibe: string;
}
