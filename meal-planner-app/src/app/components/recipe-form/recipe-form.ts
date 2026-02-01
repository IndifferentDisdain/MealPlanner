import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe, Ingredient } from '../../models/recipe';
import { RecipeService } from '../../services/recipe';

@Component({
  selector: 'app-recipe-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css'
})
export class RecipeFormComponent implements OnInit {
  recipeId: string | null = null;
  isEditMode = false;

  // Form fields
  recipeName = '';
  servings: number | null = null;
  prepTime: number | null = null;
  cookTime: number | null = null;
  ingredients: Ingredient[] = [];
  instructions: string[] = [];

  // Inline ingredient form
  showIngredientForm = false;
  newIngredient = { quantity: '', unit: '', name: '' };

  // Inline instruction form
  showInstructionForm = false;
  newInstruction = '';

  // Validation
  validationErrors: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.recipeId;

    if (this.isEditMode && this.recipeId) {
      this.loadRecipe(this.recipeId);
    }
  }

  loadRecipe(id: string): void {
    const recipe = this.recipeService.getRecipeById(id);
    if (recipe) {
      this.recipeName = recipe.name;
      this.servings = recipe.servings;
      this.prepTime = recipe.prepTime || null;
      this.cookTime = recipe.cookTime || null;
      this.ingredients = [...recipe.ingredients];
      this.instructions = [...recipe.instructions];
    } else {
      // Recipe not found, navigate back
      this.router.navigate(['/recipes']);
    }
  }

  // Ingredient methods
  toggleIngredientForm(): void {
    this.showIngredientForm = !this.showIngredientForm;
    if (this.showIngredientForm) {
      this.newIngredient = { quantity: '', unit: '', name: '' };
    }
  }

  addIngredient(): void {
    if (this.newIngredient.name.trim()) {
      this.ingredients.push({ ...this.newIngredient });
      this.newIngredient = { quantity: '', unit: '', name: '' };
      // Keep form open for quick adding
    }
  }

  removeIngredient(index: number): void {
    this.ingredients.splice(index, 1);
  }

  // Instruction methods
  toggleInstructionForm(): void {
    this.showInstructionForm = !this.showInstructionForm;
    if (this.showInstructionForm) {
      this.newInstruction = '';
    }
  }

  addInstruction(): void {
    if (this.newInstruction.trim()) {
      this.instructions.push(this.newInstruction.trim());
      this.newInstruction = '';
      // Keep form open for quick adding
    }
  }

  removeInstruction(index: number): void {
    this.instructions.splice(index, 1);
  }

  // Form validation
  validateForm(): boolean {
    this.validationErrors = [];

    if (!this.recipeName.trim()) {
      this.validationErrors.push('Recipe name is required');
    }

    if (this.ingredients.length === 0) {
      this.validationErrors.push('At least one ingredient is required');
    }

    if (this.instructions.length === 0) {
      this.validationErrors.push('At least one instruction step is required');
    }

    return this.validationErrors.length === 0;
  }

  // Save recipe
  saveRecipe(): void {
    if (!this.validateForm()) {
      return;
    }

    const recipeData: Omit<Recipe, 'id'> = {
      name: this.recipeName.trim(),
      servings: this.servings || 1,
      ingredients: this.ingredients,
      instructions: this.instructions,
      prepTime: this.prepTime || undefined,
      cookTime: this.cookTime || undefined
    };

    if (this.isEditMode && this.recipeId) {
      this.recipeService.updateRecipe(this.recipeId, recipeData);
    } else {
      this.recipeService.createRecipe(recipeData);
    }

    this.router.navigate(['/recipes']);
  }

  // Cancel
  cancel(): void {
    this.router.navigate(['/recipes']);
  }

  // Helper to format ingredient display
  formatIngredient(ingredient: Ingredient): string {
    const parts = [];
    if (ingredient.quantity) parts.push(ingredient.quantity);
    if (ingredient.unit) parts.push(ingredient.unit);
    parts.push(ingredient.name);
    return parts.join(' ');
  }
}
