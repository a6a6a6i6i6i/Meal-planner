import type { Meal } from "@/types";

export const SEED_MEALS: Meal[] = [
  {
    id: "seed-scrambled-eggs-smoked-salmon-avocado",
    name: "Scrambled eggs, smoked salmon & avocado",
    calories: 440, protein: 25, carbs: 10, fat: 34,
    ingredients: [
      { ingredientId: "seed-scrambled-eggs-smoked-salmon-avocado-scrambled-eggs-2-large", name: "Scrambled eggs (2 large)", defaultGrams: 115, caloriesPer100g: 192, proteinPer100g: 11.6, carbsPer100g: 1.5, fatPer100g: 15.4 },
      { ingredientId: "seed-scrambled-eggs-smoked-salmon-avocado-smoked-salmon", name: "Smoked salmon", defaultGrams: 50, caloriesPer100g: 118, proteinPer100g: 18.0, carbsPer100g: 0.0, fatPer100g: 3.8 },
      { ingredientId: "seed-scrambled-eggs-smoked-salmon-avocado-avocado-1-2", name: "Avocado (1/2)", defaultGrams: 100, caloriesPer100g: 160, proteinPer100g: 2.6, carbsPer100g: 8.1, fatPer100g: 14.7 },
    ],
  },
  {
    id: "seed-glop",
    name: "Glop",
    calories: 393, protein: 52, carbs: 28, fat: 8,
    ingredients: [
      { ingredientId: "seed-glop-fage-0-greek-yogurt", name: "Fage 0% Greek yogurt", defaultGrams: 225, caloriesPer100g: 61, proteinPer100g: 10.4, carbsPer100g: 3.6, fatPer100g: 0.4 },
      { ingredientId: "seed-glop-chia-seeds", name: "Chia seeds", defaultGrams: 20, caloriesPer100g: 486, proteinPer100g: 15.2, carbsPer100g: 40.3, fatPer100g: 31.1 },
      { ingredientId: "seed-glop-skimmed-milk", name: "Skimmed milk", defaultGrams: 50, caloriesPer100g: 34, proteinPer100g: 3.4, carbsPer100g: 5.0, fatPer100g: 0.1 },
      { ingredientId: "seed-glop-whey-protein", name: "Whey protein", defaultGrams: 30, caloriesPer100g: 377, proteinPer100g: 80.0, carbsPer100g: 6.7, fatPer100g: 3.3 },
      { ingredientId: "seed-glop-blueberries", name: "Blueberries", defaultGrams: 50, caloriesPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14.2, fatPer100g: 0.3 },
    ],
  },
  {
    id: "seed-pasta-bolognese",
    name: "Pasta bolognese",
    calories: 614, protein: 26, carbs: 99, fat: 12,
    ingredients: [
      { ingredientId: "seed-pasta-bolognese-durum-wheat-pasta-dry", name: "Durum wheat pasta (dry)", defaultGrams: 120, caloriesPer100g: 380, proteinPer100g: 11.9, carbsPer100g: 78.1, fatPer100g: 1.9 },
      { ingredientId: "seed-pasta-bolognese-bolognese-ragu-rummo", name: "Bolognese ragu (Rummo)", defaultGrams: 100, caloriesPer100g: 116, proteinPer100g: 8.8, carbsPer100g: 4.0, fatPer100g: 6.8 },
      { ingredientId: "seed-pasta-bolognese-parmesan-grated", name: "Parmesan, grated", defaultGrams: 10, caloriesPer100g: 418, proteinPer100g: 31.6, carbsPer100g: 15.8, fatPer100g: 30.7 },
    ],
  },
  {
    id: "seed-whey-protein-shake",
    name: "Whey protein shake",
    calories: 113, protein: 24, carbs: 2, fat: 1,
    ingredients: [
      { ingredientId: "seed-whey-protein-shake-whey-protein", name: "Whey protein", defaultGrams: 30, caloriesPer100g: 377, proteinPer100g: 80.0, carbsPer100g: 6.7, fatPer100g: 3.3 },
    ],
  },
  {
    id: "seed-greek-yogurt-almonds",
    name: "Greek yogurt & almonds",
    calories: 193, protein: 7, carbs: 7, fat: 15,
    ingredients: [
      { ingredientId: "seed-greek-yogurt-almonds-greek-style-yoghurt-full-fat", name: "Greek style yoghurt (full fat)", defaultGrams: 100, caloriesPer100g: 123, proteinPer100g: 4.0, carbsPer100g: 5.0, fatPer100g: 9.0 },
      { ingredientId: "seed-greek-yogurt-almonds-almonds-10", name: "Almonds (10)", defaultGrams: 12, caloriesPer100g: 584, proteinPer100g: 23.0, carbsPer100g: 18.4, fatPer100g: 50.6 },
    ],
  },
  {
    id: "seed-apple-macadamia-nut-butter",
    name: "Apple & macadamia nut butter",
    calories: 190, protein: 2, carbs: 29, fat: 9,
    ingredients: [
      { ingredientId: "seed-apple-macadamia-nut-butter-apple-with-skin", name: "Apple with skin", defaultGrams: 180, caloriesPer100g: 52, proteinPer100g: 0.1, carbsPer100g: 14.0, fatPer100g: 0.0 },
      { ingredientId: "seed-apple-macadamia-nut-butter-macadamia-coconut-nut-butter", name: "Macadamia & coconut nut butter", defaultGrams: 15, caloriesPer100g: 640, proteinPer100g: 13.3, carbsPer100g: 26.7, fatPer100g: 59.3 },
    ],
  },
  {
    id: "seed-banana",
    name: "Banana",
    calories: 104, protein: 1, carbs: 27, fat: 0,
    ingredients: [
      { ingredientId: "seed-banana-banana-1-medium", name: "Banana (1 medium)", defaultGrams: 118, caloriesPer100g: 88, proteinPer100g: 0.8, carbsPer100g: 22.9, fatPer100g: 0.0 },
    ],
  },
  {
    id: "seed-dark-chocolate-70",
    name: "Dark chocolate 70%",
    calories: 85, protein: 1, carbs: 5, fat: 6,
    ingredients: [
      { ingredientId: "seed-dark-chocolate-70-dark-chocolate-70", name: "Dark chocolate 70%", defaultGrams: 15, caloriesPer100g: 565, proteinPer100g: 7.8, carbsPer100g: 31.7, fatPer100g: 42.8 },
    ],
  },
  {
    id: "seed-mixed-nuts",
    name: "Mixed nuts",
    calories: 72, protein: 2, carbs: 2, fat: 6,
    ingredients: [
      { ingredientId: "seed-mixed-nuts-mixed-nuts", name: "Mixed nuts", defaultGrams: 15, caloriesPer100g: 477, proteinPer100g: 14.6, carbsPer100g: 15.9, fatPer100g: 42.9 },
    ],
  },
  {
    id: "seed-chuck-steak",
    name: "Chuck steak",
    calories: 241, protein: 38, carbs: 0, fat: 10,
    ingredients: [
      { ingredientId: "seed-chuck-steak-beef-chuck-steak", name: "Beef chuck steak", defaultGrams: 180, caloriesPer100g: 134, proteinPer100g: 20.9, carbsPer100g: 0.1, fatPer100g: 5.5 },
    ],
  },
  {
    id: "seed-sweet-potatoes",
    name: "Sweet potatoes",
    calories: 220, protein: 3, carbs: 29, fat: 11,
    ingredients: [
      { ingredientId: "seed-sweet-potatoes-roasted-sweet-potato", name: "Roasted sweet potato", defaultGrams: 150, caloriesPer100g: 147, proteinPer100g: 1.9, carbsPer100g: 19.2, fatPer100g: 7.5 },
    ],
  },
  {
    id: "seed-asparagus",
    name: "Asparagus",
    calories: 23, protein: 2, carbs: 4, fat: 0,
    ingredients: [
      { ingredientId: "seed-asparagus-asparagus-cooked", name: "Asparagus, cooked", defaultGrams: 100, caloriesPer100g: 23, proteinPer100g: 1.8, carbsPer100g: 3.5, fatPer100g: 0.0 },
    ],
  },
  {
    id: "seed-broccoli",
    name: "Broccoli",
    calories: 41, protein: 3, carbs: 5, fat: 2,
    ingredients: [
      { ingredientId: "seed-broccoli-broccoli-roasted", name: "Broccoli, roasted", defaultGrams: 100, caloriesPer100g: 41, proteinPer100g: 2.6, carbsPer100g: 5.2, fatPer100g: 2.0 },
    ],
  },
  {
    id: "seed-peas",
    name: "Peas",
    calories: 81, protein: 5, carbs: 14, fat: 0,
    ingredients: [
      { ingredientId: "seed-peas-peas", name: "Peas", defaultGrams: 100, caloriesPer100g: 81, proteinPer100g: 5.4, carbsPer100g: 14.5, fatPer100g: 0.4 },
    ],
  },
  {
    id: "seed-borlotti-beans",
    name: "Borlotti beans",
    calories: 136, protein: 9, carbs: 24, fat: 0,
    ingredients: [
      { ingredientId: "seed-borlotti-beans-borlotti-beans-cooked", name: "Borlotti beans, cooked", defaultGrams: 100, caloriesPer100g: 136, proteinPer100g: 9.3, carbsPer100g: 24.5, fatPer100g: 0.5 },
    ],
  },
  {
    id: "seed-cauliflower",
    name: "Cauliflower",
    calories: 49, protein: 2, carbs: 4, fat: 3,
    ingredients: [
      { ingredientId: "seed-cauliflower-cauliflower-roasted", name: "Cauliflower, roasted", defaultGrams: 100, caloriesPer100g: 49, proteinPer100g: 2.0, carbsPer100g: 4.0, fatPer100g: 3.3 },
    ],
  },
  {
    id: "seed-brussels-sprouts",
    name: "Brussels sprouts",
    calories: 69, protein: 3, carbs: 8, fat: 4,
    ingredients: [
      { ingredientId: "seed-brussels-sprouts-brussels-sprouts-roasted", name: "Brussels sprouts, roasted", defaultGrams: 100, caloriesPer100g: 69, proteinPer100g: 2.7, carbsPer100g: 8.0, fatPer100g: 3.7 },
    ],
  },
  {
    id: "seed-eggs-mackerel",
    name: "Eggs & mackerel",
    calories: 540, protein: 39, carbs: 2, fat: 42,
    ingredients: [
      { ingredientId: "seed-eggs-mackerel-scrambled-eggs-2-large", name: "Scrambled eggs (2 large)", defaultGrams: 115, caloriesPer100g: 192, proteinPer100g: 11.6, carbsPer100g: 1.5, fatPer100g: 15.4 },
      { ingredientId: "seed-eggs-mackerel-mackerel-fillets", name: "Mackerel fillets", defaultGrams: 120, caloriesPer100g: 266, proteinPer100g: 21.4, carbsPer100g: 0.0, fatPer100g: 20.5 },
    ],
  },
  {
    id: "seed-lamb-chops",
    name: "Lamb chops",
    calories: 294, protein: 49, carbs: 1, fat: 11,
    ingredients: [
      { ingredientId: "seed-lamb-chops-lamb-chops-grilled", name: "Lamb chops, grilled", defaultGrams: 170, caloriesPer100g: 173, proteinPer100g: 28.8, carbsPer100g: 0.6, fatPer100g: 6.3 },
    ],
  },
  {
    id: "seed-grilled-chicken-thigh",
    name: "Grilled chicken thigh",
    calories: 498, protein: 54, carbs: 2, fat: 29,
    ingredients: [
      { ingredientId: "seed-grilled-chicken-thigh-chicken-thigh-grilled", name: "Chicken thigh, grilled", defaultGrams: 200, caloriesPer100g: 249, proteinPer100g: 27.2, carbsPer100g: 1.1, fatPer100g: 14.4 },
    ],
  },
  {
    id: "seed-shrimp-vegetable-stir-fry",
    name: "Shrimp & vegetable stir-fry",
    calories: 152, protein: 16, carbs: 9, fat: 7,
    ingredients: [
      { ingredientId: "seed-shrimp-vegetable-stir-fry-shrimp-vegetable-stir-fry", name: "Shrimp & vegetable stir-fry", defaultGrams: 200, caloriesPer100g: 76, proteinPer100g: 8.1, carbsPer100g: 4.4, fatPer100g: 3.4 },
    ],
  },
];
