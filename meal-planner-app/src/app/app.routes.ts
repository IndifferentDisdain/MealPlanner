import { Routes } from '@angular/router';
import { RecipeListComponent } from './components/recipe-list/recipe-list';
import { RecipeFormComponent } from './components/recipe-form/recipe-form';
import { MealPlanComponent } from './components/meal-plan/meal-plan';
import { ShoppingListComponent } from './components/shopping-list/shopping-list';

export const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/new', component: RecipeFormComponent },
  { path: 'recipes/:id/edit', component: RecipeFormComponent },
  { path: 'plan', component: MealPlanComponent },
  { path: 'shopping', component: ShoppingListComponent }
];
