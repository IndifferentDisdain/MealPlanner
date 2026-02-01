import { Injectable } from '@angular/core';
import { ShoppingList, ShoppingListItem, Ingredient } from '../models/recipe';
import { RecipeService } from './recipe';
import { MealPlanService } from './meal-plan';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private readonly STORAGE_KEY = 'meal_planner_shopping_list';

  constructor(
    private recipeService: RecipeService,
    private mealPlanService: MealPlanService
  ) {}

  getShoppingList(): ShoppingList {
    return this.generateShoppingList();
  }

  toggleItemChecked(itemIndex: number): void {
    const list = this.getShoppingList();
    if (list.items[itemIndex]) {
      list.items[itemIndex].checked = !list.items[itemIndex].checked;
      this.saveCheckedState(list);
    }
  }

  private generateShoppingList(): ShoppingList {
    const mealPlan = this.mealPlanService.getMealPlan();
    const allIngredients: Array<Ingredient & { scaleFactor: number }> = [];

    // Collect all ingredients from meal plan
    Object.entries(mealPlan.dinners).forEach(([_, dinner]) => {
      const recipe = this.recipeService.getRecipeById(dinner.recipeId);
      if (recipe) {
        const scaleFactor = dinner.servings / recipe.servings;
        recipe.ingredients.forEach(ingredient => {
          allIngredients.push({ ...ingredient, scaleFactor });
        });
      }
    });

    // Aggregate and categorize ingredients
    const aggregated = this.aggregateIngredients(allIngredients);
    const items = aggregated.map(item => ({
      ...item,
      category: this.categorizeIngredient(item.name),
      checked: false
    }));

    // Sort by category
    items.sort((a, b) => {
      const categoryOrder = ['Produce', 'Dairy', 'Meat & Seafood', 'Pantry', 'Other'];
      const aIndex = categoryOrder.indexOf(a.category);
      const bIndex = categoryOrder.indexOf(b.category);
      return aIndex - bIndex;
    });

    // Restore checked state
    const saved = this.getCheckedState();
    if (saved) {
      items.forEach((item, i) => {
        const savedItem = saved.items.find(s =>
          s.name === item.name && s.unit === item.unit
        );
        if (savedItem) {
          item.checked = savedItem.checked;
        }
      });
    }

    return {
      items,
      generatedDate: new Date().toISOString()
    };
  }

  private aggregateIngredients(
    ingredients: Array<Ingredient & { scaleFactor: number }>
  ): Array<{ name: string; quantity: number | string; unit: string }> {
    const aggregated = new Map<string, { quantity: number; unit: string; name: string }>();

    ingredients.forEach(ingredient => {
      const normalizedName = ingredient.name.toLowerCase().trim();
      const normalizedUnit = ingredient.unit.toLowerCase().trim();
      const key = `${normalizedName}|${normalizedUnit}`;

      // Parse quantity
      const parsedQty = this.parseQuantity(ingredient.quantity);
      const scaledQty = parsedQty * ingredient.scaleFactor;

      if (aggregated.has(key)) {
        const existing = aggregated.get(key)!;
        existing.quantity += scaledQty;
      } else {
        aggregated.set(key, {
          name: ingredient.name,
          quantity: scaledQty,
          unit: ingredient.unit
        });
      }
    });

    // Convert back to array and format quantities
    return Array.from(aggregated.values()).map(item => ({
      name: item.name,
      quantity: this.formatQuantity(item.quantity),
      unit: item.unit
    }));
  }

  private parseQuantity(quantityStr: string): number {
    // Handle "to taste" or empty quantities
    if (!quantityStr || quantityStr.toLowerCase().includes('to taste')) {
      return 0;
    }

    // Handle fractions like "1/2", "1/4", "2/3"
    if (quantityStr.includes('/')) {
      const parts = quantityStr.split('/');
      if (parts.length === 2) {
        const numerator = parseFloat(parts[0].trim());
        const denominator = parseFloat(parts[1].trim());
        return numerator / denominator;
      }
    }

    // Handle mixed numbers like "1 1/2"
    const mixedMatch = quantityStr.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const whole = parseFloat(mixedMatch[1]);
      const numerator = parseFloat(mixedMatch[2]);
      const denominator = parseFloat(mixedMatch[3]);
      return whole + (numerator / denominator);
    }

    // Parse regular number
    const parsed = parseFloat(quantityStr);
    return isNaN(parsed) ? 0 : parsed;
  }

  private formatQuantity(quantity: number): number | string {
    if (quantity === 0) {
      return 'to taste';
    }
    // Round to 2 decimal places
    return Math.round(quantity * 100) / 100;
  }

  private categorizeIngredient(name: string): string {
    const nameLower = name.toLowerCase();

    // Produce
    const produceKeywords = [
      'onion', 'garlic', 'carrot', 'celery', 'bell pepper', 'pepper', 'broccoli',
      'tomato', 'lettuce', 'spinach', 'vegetable', 'apple', 'banana', 'lemon',
      'lime', 'orange', 'ginger'
    ];
    if (produceKeywords.some(keyword => nameLower.includes(keyword))) {
      return 'Produce';
    }

    // Dairy
    const dairyKeywords = [
      'milk', 'cream', 'cheese', 'butter', 'yogurt', 'sour cream', 'parmesan'
    ];
    if (dairyKeywords.some(keyword => nameLower.includes(keyword))) {
      return 'Dairy';
    }

    // Meat & Seafood
    const meatKeywords = [
      'chicken', 'beef', 'pork', 'turkey', 'fish', 'shrimp', 'salmon', 'breast'
    ];
    if (meatKeywords.some(keyword => nameLower.includes(keyword))) {
      return 'Meat & Seafood';
    }

    // Pantry
    const pantryKeywords = [
      'pasta', 'rice', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'vinegar',
      'soy sauce', 'sauce', 'cumin', 'paprika', 'oregano', 'basil', 'thyme',
      'lentil', 'broth', 'cornstarch', 'sesame'
    ];
    if (pantryKeywords.some(keyword => nameLower.includes(keyword))) {
      return 'Pantry';
    }

    return 'Other';
  }

  private saveCheckedState(list: ShoppingList): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
  }

  private getCheckedState(): ShoppingList | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
}
