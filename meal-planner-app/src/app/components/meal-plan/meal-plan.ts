import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe';
import { MealPlanService } from '../../services/meal-plan';
import { Recipe, MealPlanEntry } from '../../models/recipe';

interface DayCard {
  index: number;
  name: string;
  dinner?: {
    recipe: Recipe;
    servings: number;
  };
}

@Component({
  selector: 'app-meal-plan',
  imports: [CommonModule],
  templateUrl: './meal-plan.html',
  styleUrl: './meal-plan.css',
})
export class MealPlanComponent implements OnInit {
  days: DayCard[] = [];
  showRecipePicker = false;
  selectedDayIndex: number | null = null;
  pickerServings = 4;
  allRecipes: Recipe[] = [];
  dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    private recipeService: RecipeService,
    private mealPlanService: MealPlanService
  ) {}

  ngOnInit(): void {
    this.loadMealPlan();
  }

  loadMealPlan(): void {
    this.allRecipes = this.recipeService.getAllRecipes();
    this.days = this.dayNames.map((name, index) => {
      const dinner = this.mealPlanService.getDinnerForDay(index);
      return {
        index,
        name,
        dinner: dinner ? this.getDinnerDetails(dinner) : undefined
      };
    });
  }

  getDinnerDetails(entry: MealPlanEntry): { recipe: Recipe; servings: number } | undefined {
    const recipe = this.recipeService.getRecipeById(entry.recipeId);
    return recipe ? { recipe, servings: entry.servings } : undefined;
  }

  openRecipePicker(dayIndex: number): void {
    this.selectedDayIndex = dayIndex;
    const currentDinner = this.mealPlanService.getDinnerForDay(dayIndex);
    this.pickerServings = currentDinner?.servings ?? 4;
    this.showRecipePicker = true;
  }

  closeRecipePicker(): void {
    this.showRecipePicker = false;
    this.selectedDayIndex = null;
  }

  selectRecipe(recipe: Recipe): void {
    if (this.selectedDayIndex !== null) {
      this.mealPlanService.setDinner(this.selectedDayIndex, recipe.id, this.pickerServings);
      this.loadMealPlan();
      this.closeRecipePicker();
    }
  }

  removeDinner(dayIndex: number): void {
    this.mealPlanService.removeDinner(dayIndex);
    this.loadMealPlan();
  }

  incrementServings(): void {
    if (this.pickerServings < 12) {
      this.pickerServings++;
    }
  }

  decrementServings(): void {
    if (this.pickerServings > 1) {
      this.pickerServings--;
    }
  }

  resetDemo(): void {
    if (confirm('Reset to demo data? This will replace your current meal plan.')) {
      this.recipeService.resetToSeedData();
      this.mealPlanService.resetToDemoData();
      this.loadMealPlan();
    }
  }

  getTotalTime(recipe: Recipe): number {
    return (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
  }
}
