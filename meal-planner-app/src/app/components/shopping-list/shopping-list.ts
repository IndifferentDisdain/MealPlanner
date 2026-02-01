import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShoppingListService } from '../../services/shopping-list';
import { ShoppingListItem } from '../../models/recipe';

interface CategoryGroup {
  name: string;
  items: Array<ShoppingListItem & { index: number }>;
  expanded: boolean;
  checkedCount: number;
  totalCount: number;
}

@Component({
  selector: 'app-shopping-list',
  imports: [CommonModule],
  templateUrl: './shopping-list.html',
  styleUrl: './shopping-list.css',
})
export class ShoppingListComponent implements OnInit {
  categories: CategoryGroup[] = [];
  isEmpty = false;

  constructor(
    private shoppingListService: ShoppingListService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadShoppingList();
  }

  loadShoppingList(): void {
    const shoppingList = this.shoppingListService.getShoppingList();

    if (shoppingList.items.length === 0) {
      this.isEmpty = true;
      this.categories = [];
      return;
    }

    this.isEmpty = false;

    // Group items by category
    const categoryMap = new Map<string, Array<ShoppingListItem & { index: number }>>();

    shoppingList.items.forEach((item, index) => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, []);
      }
      categoryMap.get(item.category)!.push({ ...item, index });
    });

    // Convert to CategoryGroup array
    this.categories = Array.from(categoryMap.entries()).map(([name, items]) => ({
      name,
      items,
      expanded: true,
      checkedCount: items.filter(i => i.checked).length,
      totalCount: items.length
    }));

    // Sort categories
    const categoryOrder = ['Produce', 'Dairy', 'Meat & Seafood', 'Pantry', 'Other'];
    this.categories.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.name);
      const bIndex = categoryOrder.indexOf(b.name);
      return aIndex - bIndex;
    });
  }

  toggleCategory(category: CategoryGroup): void {
    category.expanded = !category.expanded;
  }

  toggleItem(itemIndex: number): void {
    this.shoppingListService.toggleItemChecked(itemIndex);
    this.loadShoppingList();
  }

  formatQuantity(item: ShoppingListItem): string {
    if (item.quantity === 'to taste' || item.quantity === 0) {
      return '';
    }
    const unit = item.unit ? ` ${item.unit}` : '';
    return `${item.quantity}${unit}`;
  }

  goToMealPlan(): void {
    this.router.navigate(['/plan']);
  }
}
