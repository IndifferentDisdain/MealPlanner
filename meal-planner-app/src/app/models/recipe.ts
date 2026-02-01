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
