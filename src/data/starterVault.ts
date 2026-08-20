import { ObsidianRecipe } from '../types';
import { parseObsidianRecipeMarkdown } from '../utils/markdownParser';

export const DEFAULT_VAULT_PATH = '/home/sid/Obsidian Vault/6 - Full Notes/Food/Recipes';

export const STARTER_RECIPE_MARKDOWNS: { fileName: string; markdown: string }[] = [
  {
    fileName: 'Creamy Tuscan Garlic Chicken.md',
    markdown: `---
title: Creamy Tuscan Garlic Chicken
tags:
  - food/recipes
  - dinner
  - italian
  - high-protein
  - quick-30min
category: Main Course
cuisine: Italian
prep_time: 10 mins
cook_time: 20 mins
servings: 4
difficulty: Easy
rating: 5
calories: 520
image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80"
source: "https://tuscanykitchen.org/garlic-chicken"
created: 2026-08-10
---

# Creamy Tuscan Garlic Chicken

> [!tip] Chef's Secret
> Sear the chicken breasts in the sun-dried tomato oil for an incredible depth of savory flavor before deglazing the pan with dry white wine or chicken broth!

## 🥘 Ingredients
- [ ] 2 large [[Boneless Skinless Chicken Breasts]], halved horizontally
- [ ] 2 tbsp [[Extra Virgin Olive Oil]] (or sun-dried tomato oil)
- [ ] 1 tsp [[Italian Seasoning]]
- [ ] 1 tsp [[Garlic Powder]]
- [ ] 1/2 tsp [[Smoked Paprika]]
- [ ] 1/2 tsp [[Kosher Salt]]
- [ ] 1/4 tsp [[Freshly Ground Black Pepper]]
- [ ] 1 tbsp [[Unsalted Butter]]
- [ ] 6 cloves [[Garlic]], finely minced
- [ ] 1/2 cup [[Sun-Dried Tomatoes]], drained and chopped
- [ ] 1 cup [[Heavy Cream]]
- [ ] 1/2 cup [[Low-Sodium Chicken Broth]]
- [ ] 1/2 cup [[Parmigiano-Reggiano]], freshly grated
- [ ] 3 cups [[Fresh Baby Spinach]], washed and stemmed
- [ ] 1 tbsp [[Fresh Basil]], thinly sliced

## 🍳 Instructions
1. Season chicken cutlets on both sides with salt, pepper, garlic powder, smoked paprika, and Italian seasoning.
2. Heat olive oil and butter in a large skillet over medium-high heat. Add chicken and sear for 5 minutes per side until golden brown and cooked through (internal temp 165°F / 74°C). Transfer chicken to a warm plate.
3. In the same skillet over medium heat, add minced garlic and sauté for 1 minute until fragrant.
4. Add sun-dried tomatoes and low-sodium chicken broth, scraping up any browned bits from the bottom of the pan. Simmer for 3 minutes to reduce slightly.
5. Reduce heat to low. Pour in heavy cream and gently stir in grated Parmigiano-Reggiano until melted and velvety smooth.
6. Add baby spinach and stir for 2 minutes until wilted into the sauce.
7. Return chicken to skillet, spooning sauce over top, and simmer together for 3 minutes so flavors marry.
8. Garnish with fresh basil and serve hot over fettuccine, mashed potatoes, or crusty sourdough bread.

## 💡 Notes & Variations
- **Keto / Low-Carb**: Perfect as-is; serve over steamed zucchini noodles or roasted broccoli.
- **Dairy-Free**: Substitute full-fat coconut cream and nutritional yeast or dairy-free parmesan.
- **Wine Pairing**: Pairs beautifully with an Italian Pinot Grigio or Crisp Sauvignon Blanc.
`,
  },
  {
    fileName: 'Authentic Tonkotsu Shoyu Ramen.md',
    markdown: `---
title: Authentic Tonkotsu Shoyu Ramen
tags:
  - food/recipes
  - japanese
  - soup
  - comfort-food
  - weekend-project
category: Soup & Noodles
cuisine: Japanese
prep_time: 30 mins
cook_time: 45 mins
servings: 4
difficulty: Medium
rating: 5
calories: 680
image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80"
created: 2026-08-12
---

# Authentic Tonkotsu Shoyu Ramen

> [!important] Broth Magic
> Emulsify the rich pork broth with tare sauce right before pouring over the boiled alkaline ramen noodles to maintain perfect aromatic heat!

## 🥘 Ingredients
- [ ] 4 portions [[Fresh Ramen Noodles]] (alkaline)
- [ ] 6 cups [[Rich Pork Bone Broth]] (Tonkotsu stock)
- [ ] 4 slices [[Chashu Pork Belly]]
- [ ] 4 [[Ajitsuke Tamago]] (soft-boiled soy marinated ramen eggs), halved
- [ ] 4 tbsp [[Shoyu Ramen Tare]] (Soy sauce seasoning base)
- [ ] 2 tbsp [[Mayu]] (Black garlic aromatic oil)
- [ ] 1 cup [[Menma]] (Seasoned bamboo shoots)
- [ ] 4 sheets [[Nori Seaweed]]
- [ ] 4 stalks [[Scallions]], finely sliced into rounds
- [ ] 1 tbsp [[Toasted White Sesame Seeds]]
- [ ] 1/2 tsp [[Ichimi Togarashi]] (Japanese chili pepper)

## 🍳 Instructions
1. Bring a large pot of water to a rolling boil for the fresh noodles. Keep bowls warmed.
2. In each serving bowl, add 1 tablespoon of shoyu tare and 1/2 teaspoon of mayu (black garlic oil).
3. In a separate saucepan, bring the tonkotsu broth to a vigorous simmer for 5 minutes until piping hot and fully emulsified.
4. Drop fresh ramen noodles into the boiling water and cook for 90 seconds (firm/al dente).
5. Drain noodles thoroughly, shaking off excess water vigorously.
6. Ladle 1.5 cups of boiling tonkotsu broth into each bowl with tare and whisk briskly.
7. Fold noodles neatly into the broth using chopsticks.
8. Top each bowl with chashu pork, halved ramen egg, menma bamboo shoots, nori sheet, and generous sliced scallions. Sprinkle with sesame seeds and serve immediately while steaming.

## 💡 Notes & Variations
- **Make-Ahead Tare**: Prepare soy tare and marinate ramen eggs 24-48 hours in advance in the fridge.
- **Side Pairing**: Fantastic served with crispy pan-fried pork and cabbage gyoza!
`,
  },
  {
    fileName: 'Artisan Sourdough Boule.md',
    markdown: `---
title: Artisan Sourdough Boule
tags:
  - food/recipes
  - baking
  - bread
  - sourdough
  - weekend-project
category: Baking & Breads
cuisine: French
prep_time: 45 mins
cook_time: 40 mins
servings: 8
difficulty: Hard
rating: 5
calories: 180
image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1200&q=80"
created: 2026-08-05
---

# Artisan Sourdough Boule

> [!tip] Dutch Oven Steam
> Preheating the heavy cast-iron Dutch oven for at least 45 minutes at 450°F (230°C) is essential for blistering oven spring and a crackling golden crust.

## 🥘 Ingredients
- [ ] 450 g [[Bread Flour]] (unbleached, high protein)
- [ ] 50 g [[Whole Wheat Flour]]
- [ ] 375 g [[Filtered Water]] (lukewarm, 78°F / 26°C)
- [ ] 100 g [[Active Sourdough Starter]] (levain at peak rise)
- [ ] 10 g [[Fine Sea Salt]]
- [ ] 25 g [[Rice Flour]] (for dusting banneton proofing basket)

## 🍳 Instructions
1. **Autolyse**: In a large mixing bowl, combine bread flour, whole wheat flour, and 350g water until no dry bits remain. Cover and rest for 45 minutes.
2. **Add Starter & Salt**: Add active sourdough starter and salt with remaining 25g water. Dimple and fold with wet hands until fully incorporated. Rest for 30 minutes.
3. **Stretch & Folds**: Perform 4 sets of stretch and folds spaced 30 minutes apart over 2 hours. Keep dough warm at 76°F (24°C).
4. **Bulk Fermentation**: Let dough rest undisturbed for 2 hours until increased in volume by ~40-50% with dome edges and gentle bubbles.
5. **Pre-Shape & Bench Rest**: Turn dough onto lightly floured counter, shape into loose round, and rest for 20 minutes uncovered.
6. **Final Shaping**: Dust banneton with rice flour. Shape dough into a taut boule, seal bottom seam, and transfer smooth side down into banneton.
7. **Cold Retard**: Cover banneton with shower cap and ferment in refrigerator (38°F / 3°C) for 12 to 16 hours.
8. **Bake**: Preheat Dutch oven in oven to 450°F (230°C) for 45 minutes. Invert dough onto parchment, score with razor blade, transfer to Dutch oven, cover with lid, and bake for 20 minutes.
9. **Crisp Crust**: Remove Dutch oven lid, reduce temperature to 425°F (220°C), and bake for 20 minutes until deeply browned.
10. Cool completely on wire rack for 2 hours before slicing.

## 💡 Notes & Variations
- Hydration level is 75%, ideal for open crumb and easy handling.
- Store sliced bread in a paper bag or freeze slices with parchment dividers.
`,
  },
  {
    fileName: 'Authentic Thai Green Coconut Curry.md',
    markdown: `---
title: Authentic Thai Green Coconut Curry
tags:
  - food/recipes
  - dinner
  - thai
  - curry
  - gluten-free
  - quick-30min
category: Main Course
cuisine: Thai
prep_time: 15 mins
cook_time: 15 mins
servings: 4
difficulty: Easy
rating: 5
calories: 460
image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80"
created: 2026-08-08
---

# Authentic Thai Green Coconut Curry

> [!tip] Aromatics Technique
> Fry the green curry paste in the thick coconut cream skimmed from the top of the can until the herb oil separates—this unlocks authentic Thai street-style fragrance!

## 🥘 Ingredients
- [ ] 1 can (14 oz / 400ml) [[Full-Fat Coconut Milk]] (separated into cream and milk)
- [ ] 3 tbsp [[Authentic Thai Green Curry Paste]]
- [ ] 1 lb [[Chicken Thighs]], sliced into bite-sized strips
- [ ] 1 cup [[Low-Sodium Chicken Broth]]
- [ ] 1 cup [[Thai Eggplants]] (quartered) or Chinese eggplant
- [ ] 1/2 cup [[Bamboo Shoots]], rinsed and drained
- [ ] 1/2 [[Red Bell Pepper]], sliced into thin strips
- [ ] 5 [[Makrut Lime Leaves]], torn with stems removed
- [ ] 1 tbsp [[Fish Sauce]] (Nam Pla)
- [ ] 1 tsp [[Palm Sugar]] or brown sugar
- [ ] 1 cup [[Fresh Thai Holy Basil]] (or sweet basil leaves)
- [ ] 2 [[Thai Bird's Eye Chilies]], lightly bruised (optional for heat)
- [ ] Steamed [[Jasmine Rice]], for serving

## 🍳 Instructions
1. Open coconut milk can without shaking. Spoon 1/3 cup of the thick cream into a wok or deep skillet over medium heat.
2. Sauté coconut cream for 3 minutes until oil starts to separate.
3. Add green curry paste and fry for 2 minutes until intensely aromatic.
4. Add sliced chicken thighs and stir-fry for 4 minutes until exterior turns opaque.
5. Pour in the remaining coconut milk and chicken broth. Bring to a gentle simmer.
6. Add Thai eggplants, bamboo shoots, red bell pepper, and torn makrut lime leaves. Simmer for 6 minutes until eggplants are tender.
7. Season with fish sauce and palm sugar, adjusting salty-sweet balance to taste.
8. Turn off heat. Fold in fresh Thai basil and bird's eye chilies. Stir until basil wilts in residual heat.
9. Serve immediately in wide bowls alongside hot steamed jasmine rice.

## 💡 Notes & Variations
- **Vegetarian/Vegan**: Swap chicken with extra-firm tofu or king oyster mushrooms, and use vegan soy seasoning instead of fish sauce.
`,
  },
  {
    fileName: 'Classic Roman Carbonara.md',
    markdown: `---
title: Classic Roman Carbonara
tags:
  - food/recipes
  - dinner
  - italian
  - pasta
  - authentic
  - quick-30min
category: Pasta
cuisine: Italian
prep_time: 10 mins
cook_time: 15 mins
servings: 3
difficulty: Medium
rating: 5
calories: 590
image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=1200&q=80"
created: 2026-08-11
---

# Classic Roman Carbonara

> [!warning] No Cream Allowed!
> True Roman carbonara never uses heavy cream, peas, or garlic. The rich silky emulsion comes purely from hot pasta water, egg yolks, and finely grated Pecorino Romano cheese.

## 🥘 Ingredients
- [ ] 350 g [[Spaghetti]] (or rigatoni)
- [ ] 150 g [[Guanciale]] (cured pork jowl), cut into 1/4-inch lardons (or pancetta)
- [ ] 4 large [[Pasture-Raised Egg Yolks]]
- [ ] 1 large [[Whole Egg]]
- [ ] 75 g [[Pecorino Romano]], freshly grated with microplane
- [ ] 25 g [[Parmigiano-Reggiano]], freshly grated
- [ ] 1 tbsp [[Coarsely Ground Black Peppercorns]] (toasted)
- [ ] 1 pinch [[Kosher Salt]] (for pasta water only)

## 🍳 Instructions
1. In a heat-proof mixing bowl, whisk together 4 egg yolks, 1 whole egg, grated Pecorino Romano, Parmigiano-Reggiano, and half of the crushed black pepper until thick paste forms.
2. Bring a large pot of water to a boil. Salt moderately (guanciale and pecorino are already salty).
3. Drop spaghetti into boiling water and cook for 9 minutes (2 minutes before package al dente time). Reserve 1 cup of starchy pasta water.
4. Meanwhile, place guanciale lardons in a large cold skillet over medium-low heat. Render slowly for 8 minutes until golden and crisp on the edges. Remove skillet from direct heat.
5. Transfer al dente spaghetti directly into the guanciale skillet with rendered fat.
6. Let skillet cool for 1 minute off direct heat (crucial so eggs do not scramble).
7. Pour the egg-cheese paste over the pasta and quickly toss with tongs, adding splashes of hot pasta water (about 1/4 cup) until a glossy, velvety emulsion coats every strand.
8. Plate immediately in warm bowls. Top with crispy guanciale, extra Pecorino Romano, and cracked black pepper.

## 💡 Notes & Variations
- If the sauce thickens too much on the plate, add another tablespoon of warm pasta water to re-emulsify.
`,
  },
  {
    fileName: 'Pan-Seared Lemon Herb Wild Salmon.md',
    markdown: `---
title: Pan-Seared Lemon Herb Wild Salmon
tags:
  - food/recipes
  - dinner
  - seafood
  - healthy
  - low-carb
  - quick-30min
category: Main Course
cuisine: Mediterranean
prep_time: 10 mins
cook_time: 10 mins
servings: 4
difficulty: Easy
rating: 5
calories: 420
image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80"
created: 2026-08-14
---

# Pan-Seared Lemon Herb Wild Salmon

> [!tip] Ultra-Crisp Skin
> Pat salmon fillets thoroughly dry with paper towels and press firmly with a spatula during the first 60 seconds of cooking to keep skin completely flat against the hot stainless steel pan!

## 🥘 Ingredients
- [ ] 4 (6 oz / 170g each) [[Wild Salmon Fillets]], skin-on
- [ ] 2 tbsp [[Avocado Oil]] (or high-heat olive oil)
- [ ] 2 tbsp [[Unsalted Butter]]
- [ ] 4 cloves [[Garlic]], lightly smashed
- [ ] 1 fresh [[Lemon]], zested and halved
- [ ] 3 sprigs [[Fresh Thyme]]
- [ ] 2 sprigs [[Fresh Rosemary]]
- [ ] 2 tbsp [[Fresh Dill]], chopped
- [ ] 1 tsp [[Flaky Sea Salt]] (Maldon)
- [ ] 1/2 tsp [[Freshly Cracked Black Pepper]]
- [ ] 1 tbsp [[Capers]], drained

## 🍳 Instructions
1. Pat salmon fillets completely dry with paper towels. Season both flesh and skin side with flaky sea salt and black pepper.
2. Heat avocado oil in a stainless steel or cast iron skillet over medium-high heat until shimmering.
3. Place salmon skin-side down into the pan. Press down gently with a fish spatula for 30 seconds so skin stays flat.
4. Sear undisturbed for 5 minutes until skin is golden crisp and salmon is cooked 3/4 of the way up.
5. Flip salmon fillets carefully. Reduce heat to medium-low.
6. Add butter, smashed garlic cloves, thyme sprigs, rosemary, and capers to the pan.
7. As butter foams, tilt pan and baste the salmon with the aromatic herb butter for 2 minutes.
8. Squeeze fresh lemon juice over fillets and remove from heat. Salmon should be medium-rare to medium (125°F / 52°C internal).
9. Transfer to plates, drizzle pan pan juices on top, and scatter with fresh dill and lemon zest.

## 💡 Notes & Variations
- Serve alongside roasted asparagus, garlic mashed cauliflower, or a warm quinoa bowl.
`,
  },
  {
    fileName: 'Avocado Green Goddess Quinoa Salad.md',
    markdown: `---
title: Avocado Green Goddess Quinoa Salad
tags:
  - food/recipes
  - lunch
  - salad
  - vegetarian
  - meal-prep
  - healthy
category: Salads & Bowls
cuisine: California / Fresh
prep_time: 15 mins
cook_time: 15 mins
servings: 4
difficulty: Easy
rating: 5
calories: 380
image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"
created: 2026-08-09
---

# Avocado Green Goddess Quinoa Salad

> [!tip] Herbaceous Dressing
> Blend the dressing with whole Greek yogurt and lots of fresh tarragon and dill for vibrant green color and creamy tang without mayonnaise!

## 🥘 Ingredients
- [ ] 1 cup [[Dry Tri-Color Quinoa]], rinsed
- [ ] 2 cups [[Vegetable Broth]] (or water)
- [ ] 2 cups [[Baby Arugula]] or baby kale
- [ ] 1 cup [[English Cucumber]], diced
- [ ] 1 cup [[Cherry Tomatoes]], halved
- [ ] 2 ripe [[Avocados]], pitted and cubed
- [ ] 1/2 cup [[Edamame]], shelled and cooked
- [ ] 1/3 cup [[Pumpkin Seeds]] (pepitas), toasted
- [ ] 1/2 cup [[Feta Cheese]], crumbled

### 🌿 Green Goddess Dressing
- [ ] 1 ripe [[Avocado]]
- [ ] 1/2 cup [[Greek Yogurt]] (whole milk)
- [ ] 1 cup [[Fresh Italian Parsley]]
- [ ] 1/2 cup [[Fresh Cilantro]] or dill
- [ ] 2 tbsp [[Fresh Chives]], chopped
- [ ] 1 clove [[Garlic]]
- [ ] 2 tbsp [[Fresh Lemon Juice]]
- [ ] 2 tbsp [[Extra Virgin Olive Oil]]
- [ ] 1/2 tsp [[Sea Salt]] & black pepper

## 🍳 Instructions
1. In a small pot, combine quinoa and vegetable broth. Bring to a boil, then cover, reduce heat to low, and simmer for 15 minutes until liquid is absorbed.
2. Remove quinoa from heat, fluff with fork, and spread on a plate to cool for 10 minutes.
3. Make dressing: In a blender or food processor, combine avocado, Greek yogurt, parsley, cilantro/dill, chives, garlic, lemon juice, olive oil, salt, and pepper. Blend until silky smooth and vibrant green.
4. In a large salad bowl, layer cooled quinoa, baby arugula, diced cucumber, cherry tomatoes, and edamame.
5. Drizzle half of the green goddess dressing and toss gently to coat.
6. Top with diced avocado, crumbled feta cheese, and toasted pumpkin seeds.
7. Serve with remaining dressing on the side.

## 💡 Notes & Variations
- **Meal Prep**: Keeps fresh in airtight containers in the fridge for up to 4 days (add avocado right before serving).
`,
  },
  {
    fileName: 'Molten Dark Chocolate Matcha Lava Cake.md',
    markdown: `---
title: Molten Dark Chocolate Matcha Lava Cake
tags:
  - food/recipes
  - dessert
  - baking
  - chocolate
  - japanese-fusion
category: Dessert
cuisine: Fusion
prep_time: 15 mins
cook_time: 12 mins
servings: 4
difficulty: Medium
rating: 5
calories: 410
image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80"
created: 2026-08-01
---

# Molten Dark Chocolate Matcha Lava Cake

> [!tip] Ramekin Preparation
> Butter the ramekins thoroughly in upward strokes and coat with cocoa powder so the molten cakes slide out effortlessly onto serving plates!

## 🥘 Ingredients
- [ ] 120 g [[70% Dark Bittersweet Chocolate]], chopped
- [ ] 100 g [[Unsalted Butter]]
- [ ] 2 large [[Eggs]] + 2 large [[Egg Yolks]], room temperature
- [ ] 50 g [[Granulated Sugar]]
- [ ] 30 g [[All-Purpose Flour]], sifted
- [ ] 1 pinch [[Flaky Sea Salt]]
- [ ] 1 tsp [[Vanilla Extract]]

### 🍵 Matcha Truffle Center
- [ ] 60 g [[White Chocolate]], finely chopped
- [ ] 30 ml [[Heavy Cream]]
- [ ] 1.5 tsp [[Ceremonial Grade Matcha Powder]]
- [ ] [[Powdered Sugar]] and matcha powder for dusting

## 🍳 Instructions
1. **Matcha Center**: Heat heavy cream until hot. Pour over white chocolate and whisk with matcha powder until smooth. Freeze in 4 small silicone cubes or mounds for 20 minutes.
2. Preheat oven to 425°F (220°C). Butter four 6-oz ramekins and dust inside with unsweetened cocoa powder.
3. Melt dark chocolate and butter together in a heatproof bowl set over simmering water (or microwave in 20-second bursts). Stir until glossy, then let cool for 5 minutes.
4. In a medium bowl, whisk whole eggs, egg yolks, sugar, and vanilla vigorously for 3 minutes until pale and slightly frothy.
5. Fold melted chocolate mixture into the eggs until combined.
6. Gently fold in sifted flour and pinch of salt until just incorporated (do not overmix).
7. Fill ramekins halfway with batter. Place one frozen matcha truffle in center of each, then cover with remaining batter.
8. Bake at 425°F (220°C) for 12 minutes until edges are set but center has a soft jiggle.
9. Rest for 2 minutes. Run a thin knife around edges, invert onto plates, dust with powdered sugar, and serve warm with vanilla ice cream.

## 💡 Notes & Variations
- When sliced, a vibrant green matcha and dark chocolate river flows out!
`,
  },
];

export function getStarterVaultRecipes(): ObsidianRecipe[] {
  return STARTER_RECIPE_MARKDOWNS.map((item) => {
    const filePath = `6 - Full Notes/Food/Recipes/${item.fileName}`;
    return parseObsidianRecipeMarkdown(item.markdown, item.fileName, filePath);
  });
}
