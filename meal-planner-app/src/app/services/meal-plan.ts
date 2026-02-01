import { Injectable } from '@angular/core';
import { MealPlan, MealPlanEntry } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  private readonly STORAGE_KEY = 'meal_planner_meal_plan';

  constructor() {
    // Initialize with demo data if localStorage is empty
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.resetToDemoData();
    }
  }

  getMealPlan(): MealPlan {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Return empty meal plan
    return {
      weekStart: this.getWeekStart(),
      dinners: {}
    };
  }

  getDinnerForDay(dayIndex: number): MealPlanEntry | undefined {
    const mealPlan = this.getMealPlan();
    return mealPlan.dinners[dayIndex.toString()];
  }

  setDinner(dayIndex: number, recipeId: string, servings: number): void {
    const mealPlan = this.getMealPlan();
    mealPlan.dinners[dayIndex.toString()] = { recipeId, servings };
    this.saveMealPlan(mealPlan);
  }

  removeDinner(dayIndex: number): void {
    const mealPlan = this.getMealPlan();
    delete mealPlan.dinners[dayIndex.toString()];
    this.saveMealPlan(mealPlan);
  }

  resetToDemoData(): void {
    const demoMealPlan: MealPlan = {
      weekStart: this.getWeekStart(),
      dinners: {
        '0': { recipeId: '1', servings: 4 }, // Monday: Chicken Pasta
        '2': { recipeId: '2', servings: 2 }, // Wednesday: Veggie Stir Fry
        '4': { recipeId: '3', servings: 6 }  // Friday: Lentil Soup
      }
    };
    this.saveMealPlan(demoMealPlan);
  }

  private saveMealPlan(mealPlan: MealPlan): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mealPlan));
  }

  private getWeekStart(): string {
    // Get the Monday of the current week
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust when day is Sunday
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return monday.toISOString().split('T')[0];
  }
}
