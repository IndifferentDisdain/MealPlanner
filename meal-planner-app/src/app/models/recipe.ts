export interface Ingredient {
  quantity: string;
  unit: string;
  name: string;
}

export interface Recipe {
  id: string;
  name: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: number; // minutes
  cookTime?: number; // minutes
}

export interface MealPlanEntry {
  recipeId: string;
  servings: number;
}

export interface MealPlan {
  weekStart: string; // ISO date string (Monday)
  dinners: { [dayIndex: string]: MealPlanEntry }; // 0-6 (Mon-Sun)
}

export interface ShoppingListItem {
  category: string;
  name: string;
  quantity: number | string; // number or "to taste"
  unit: string;
  checked: boolean;
}

export interface ShoppingList {
  items: ShoppingListItem[];
  generatedDate: string;
}
