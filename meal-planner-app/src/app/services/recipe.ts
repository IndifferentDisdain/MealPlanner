import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly STORAGE_KEY = 'meal_planner_recipes';

  constructor() {
    // Initialize with seed data if localStorage is empty
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.resetToSeedData();
    }
  }

  getAllRecipes(): Recipe[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getRecipeById(id: string): Recipe | undefined {
    const recipes = this.getAllRecipes();
    return recipes.find(r => r.id === id);
  }

  createRecipe(recipe: Omit<Recipe, 'id'>): Recipe {
    const recipes = this.getAllRecipes();
    const newRecipe: Recipe = {
      ...recipe,
      id: this.generateId()
    };
    recipes.push(newRecipe);
    this.saveRecipes(recipes);
    return newRecipe;
  }

  updateRecipe(id: string, updates: Partial<Recipe>): Recipe | undefined {
    const recipes = this.getAllRecipes();
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    recipes[index] = { ...recipes[index], ...updates, id }; // Preserve ID
    this.saveRecipes(recipes);
    return recipes[index];
  }

  resetToSeedData(): void {
    const seedRecipes: Recipe[] = [
      {
        id: '1',
        name: 'Creamy Chicken Pasta',
        servings: 4,
        prepTime: 10,
        cookTime: 20,
        ingredients: [
          { quantity: '2', unit: 'cups', name: 'pasta' },
          { quantity: '1', unit: 'lb', name: 'chicken breast' },
          { quantity: '1', unit: 'cup', name: 'heavy cream' },
          { quantity: '2', unit: 'cloves', name: 'garlic' },
          { quantity: '1/2', unit: 'cup', name: 'parmesan cheese' },
          { quantity: '2', unit: 'tbsp', name: 'olive oil' },
          { quantity: 'to taste', unit: '', name: 'salt' },
          { quantity: 'to taste', unit: '', name: 'black pepper' }
        ],
        instructions: [
          'Boil pasta according to package directions.',
          'Season and cook chicken in olive oil until golden brown.',
          'Add garlic and cook until fragrant.',
          'Pour in heavy cream and bring to a simmer.',
          'Add parmesan cheese and stir until melted.',
          'Combine pasta with sauce and serve.'
        ]
      },
      {
        id: '2',
        name: 'Quick Veggie Stir Fry',
        servings: 2,
        prepTime: 15,
        cookTime: 10,
        ingredients: [
          { quantity: '2', unit: 'cups', name: 'mixed vegetables (bell peppers, broccoli, carrots)' },
          { quantity: '1/4', unit: 'cup', name: 'soy sauce' },
          { quantity: '2', unit: 'tbsp', name: 'sesame oil' },
          { quantity: '2', unit: 'cloves', name: 'garlic' },
          { quantity: '1', unit: 'tbsp', name: 'ginger' },
          { quantity: '2', unit: 'cups', name: 'cooked rice' },
          { quantity: '1', unit: 'tbsp', name: 'cornstarch' }
        ],
        instructions: [
          'Heat sesame oil in a large pan or wok.',
          'Add garlic and ginger, stir for 30 seconds.',
          'Add vegetables and stir fry for 5-7 minutes.',
          'Mix soy sauce with cornstarch and add to pan.',
          'Cook until sauce thickens.',
          'Serve over rice.'
        ]
      },
      {
        id: '3',
        name: 'Hearty Lentil Soup',
        servings: 6,
        prepTime: 10,
        cookTime: 35,
        ingredients: [
          { quantity: '2', unit: 'cups', name: 'lentils' },
          { quantity: '1', unit: 'whole', name: 'onion (diced)' },
          { quantity: '2', unit: 'whole', name: 'carrots (diced)' },
          { quantity: '2', unit: 'stalks', name: 'celery (diced)' },
          { quantity: '4', unit: 'cups', name: 'vegetable broth' },
          { quantity: '2', unit: 'cups', name: 'water' },
          { quantity: '2', unit: 'tbsp', name: 'olive oil' },
          { quantity: '1', unit: 'tsp', name: 'cumin' },
          { quantity: 'to taste', unit: '', name: 'salt' },
          { quantity: 'to taste', unit: '', name: 'black pepper' }
        ],
        instructions: [
          'Heat olive oil in a large pot.',
          'Sauté onion, carrots, and celery until softened.',
          'Add lentils, broth, water, and cumin.',
          'Bring to a boil, then reduce heat and simmer for 30 minutes.',
          'Season with salt and pepper.',
          'Serve hot with crusty bread.'
        ]
      }
    ];

    this.saveRecipes(seedRecipes);
  }

  private saveRecipes(recipes: Recipe[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
