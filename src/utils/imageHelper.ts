/**
 * High-quality food photography helper for The Kitchen Codex
 */

export const DEFAULT_FOOD_IMAGES: Record<string, string> = {
  chicken: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
  ramen: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
  noodles: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1200&q=80',
  soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
  bread: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1200&q=80',
  sourdough: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=1200&q=80',
  curry: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80',
  pasta: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=1200&q=80',
  carbonara: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=1200&q=80',
  salmon: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
  seafood: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
  fish: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  quinoa: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
  dessert: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
  cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
  chocolate: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  steak: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  beef: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  taco: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
  mexican: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  asian: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=1200&q=80',
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Returns a valid, reliable image URL for a given recipe.
 * If recipe has an explicit image URL, returns it.
 * Otherwise analyzes title, cuisine, category, and tags to find the best matching food photograph.
 */
export function getRecipeImage(recipe: {
  image?: string;
  title?: string;
  category?: string;
  cuisine?: string;
  tags?: string[];
  rawMarkdown?: string;
}): string {
  // 1. Direct explicit image
  if (recipe.image && recipe.image.trim().length > 0 && !recipe.image.startsWith('undefined')) {
    return recipe.image.trim();
  }

  // 2. Search for markdown image embed in rawMarkdown
  if (recipe.rawMarkdown) {
    const mdImgMatch = recipe.rawMarkdown.match(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/i);
    if (mdImgMatch && mdImgMatch[1]) {
      return mdImgMatch[1];
    }
    const htmlImgMatch = recipe.rawMarkdown.match(/<img\s+[^>]*src=["'](https?:\/\/[^"']+)["']/i);
    if (htmlImgMatch && htmlImgMatch[1]) {
      return htmlImgMatch[1];
    }
  }

  // 3. Match keywords in title, category, cuisine, or tags
  const textCorpus = [
    recipe.title || '',
    recipe.category || '',
    recipe.cuisine || '',
    ...(recipe.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  for (const [key, url] of Object.entries(DEFAULT_FOOD_IMAGES)) {
    if (key !== 'default' && textCorpus.includes(key)) {
      return url;
    }
  }

  return DEFAULT_FOOD_IMAGES.default;
}
