# Business Requirements - Decisions Log

*Date: 2026-02-01*
*Status: Approved for Design Phase*

---

## Critical Decisions

### 1. Ingredient Input & Aggregation

**Unit Input**: Free-text (no dropdown/predefined list)
- Users can type any unit: "cups", "tbsp", "grams", "oz", etc.
- More flexible, less restrictive for MVP

**Fractional Quantities**: Supported
- Users can enter "1/2", "1/4", "2 1/2" etc.
- Aggregation should handle fraction math (1/2 + 1/4 = 3/4)

**Ingredient Matching**: Loose/fuzzy matching
- "milk" should match "whole milk", "2% milk"
- "onion" should match "yellow onion", "diced onion"
- Case-insensitive matching

**"To Taste" Ingredients**: List ingredient name only
- If quantity is "to taste" or blank, just show ingredient name on shopping list
- Example: "salt" instead of "1 tsp salt"

---

### 2. Meal Planning Behavior

**Recipes Per Slot**: One recipe only ✅
- Each meal slot holds exactly one recipe
- No support for main dish + side dish combinations in MVP

**Empty Slots**: Allowed ✅
- Users don't need to fill all 7 days
- Unplanned days are valid

**Week Start Day**: Monday ✅

**Meal Types**: **DINNER ONLY** ✅
- **SCOPE CHANGE**: MVP will only support dinner planning
- No breakfast or lunch slots
- Simplifies UI to single row per day

---

### 3. Shopping List Lifecycle

**Auto-Update**: Yes ✅
- Shopping list automatically refreshes when meal plan changes
- No manual "Regenerate" button needed

**Manual Editing**: Not supported ✅
- Users cannot add non-recipe items
- Users cannot edit quantities
- Keeps MVP simple

**Persistence**: Resets each week ✅
- New week = new shopping list
- Checked items don't carry forward

---

### 4. Recipe Management

**Recipe Deletion**: Not supported in MVP ✅
- Users cannot delete recipes
- Removes complexity around meal plan impacts
- Can add in Phase 2 if needed

**Recipe Scaling**: **SUPPORTED** ✅
- Users can adjust serving size when adding recipe to meal plan
- Example: Recipe serves 4, but user wants to cook for 2
- Shopping list should scale ingredient quantities accordingly

---

## High Priority Decisions

### 5. Initial Load Experience

**Seed Data**: 3 pre-populated recipes ✅
- Not 5-10, just 3 to keep it simple
- Should represent variety (protein, vegetarian, cuisine styles)

**Pre-Populated Meal Plan**: Yes, include a planned week ✅
- Demo should show feature in action with meals already assigned
- Makes investor demo more impressive (shows completed state)
- Example: Monday = Recipe 1, Wednesday = Recipe 2, Friday = Recipe 3

---

### 6. Interaction Patterns

**Recipe Selection**: Modal picker ✅
- Click on day → Modal opens with scrollable recipe list
- Select recipe → Modal closes, recipe added to day

**Mobile Layout**: Vertical day cards ✅
- Not horizontal 7-column grid
- Stack days vertically for better mobile UX
- Each card shows: Day name, Recipe name (or "Add Dinner")

---

### 7. Shopping List Organization

**Grouping**: By category ✅
- Group ingredients: Produce, Dairy, Meat, Pantry, etc.

**Categorization Method**: Auto-detect from ingredient names using keywords ✅
- Use keyword matching (e.g., "milk" → Dairy, "chicken" → Meat, "onion" → Produce)
- No manual category assignment by users
- Fallback to "Other" category if no match found

**Example Categories**:
- Produce (vegetables, fruits)
- Dairy (milk, cheese, yogurt, butter)
- Meat & Seafood (chicken, beef, fish)
- Pantry (flour, sugar, spices, oils)
- Other (unmatched items)

---

## Medium Priority Decisions

### 8. Data Loss & Demo Reset

**localStorage Warning**: No warning needed ✅
- MVP is for demo purposes, data loss acceptable

**Reset Demo Button**: Yes, include ✅
- Allows resetting to original 3 seed recipes + empty plan
- Useful for investor demos and testing

---

### 9. Recipe Details

**Required Fields**:
- Recipe name ✅
- At least 1 ingredient ✅
- At least 1 instruction step ✅

**Optional Fields**:
- Servings (optional, but recommended for scaling feature)
- Prep time ✅
- Cook time ✅

**Character Limits**: None ✅
- No artificial constraints on text length

---

### 10. Recipe Scaling

**Implementation**: Scale ingredients based on servings ✅
- Recipe base servings: 4
- User selects: "Cook for 2"
- All ingredient quantities × 0.5

**UI Control**: Stepper buttons (plus/minus) ✅
- Touch-friendly increment/decrement buttons
- Shows current serving count in center
- Example: [-] 4 servings [+]

**UI Location**: During meal plan assignment
- When adding recipe to day via modal, show servings stepper above recipe selection

---

## Low Priority Decisions

### 11. Recipe Discovery

**Browse Method**: Scroll only ✅
- No search/filter in MVP
- Simple scrollable list in modal

---

### 12. Servings Context

**Decision**: Deferred ✅
- Ignore for now
- May revisit in design phase

---

## Updated MVP Scope

### What Changed

**Simplified**:
- ❌ Breakfast and lunch removed (dinner only)
- ❌ Recipe deletion removed
- ❌ Manual shopping list edits removed
- ✅ Only 3 seed recipes (not 5-10)

**Added**:
- ✅ Recipe scaling when adding to meal plan

### Core User Flows (Updated)

**Flow 1: Create and Save a Recipe**
1. Click "Add Recipe"
2. Enter name, ingredients (free-text quantities/units), instructions
3. Optionally add servings, prep time, cook time
4. Save → Recipe added to list
5. *Note: Cannot delete recipes in MVP*

**Flow 2: Plan a Week of Dinners**
1. View weekly dinner planning (7 vertical day cards, Monday-Sunday)
2. Click "Add Dinner" on a day
3. Modal opens with scrollable recipe list
4. Select recipe, optionally adjust servings
5. Recipe assigned to that day
6. Repeat for other days (unplanned days are fine)

**Flow 3: Generate and Use Shopping List**
1. Shopping list auto-generates from meal plan
2. Ingredients grouped by category (Produce, Dairy, Meat, etc.)
3. Duplicate ingredients aggregated (fractions supported)
4. User checks off items while shopping
5. List resets each week

---

## ✅ All Requirements Finalized

All business requirements have been answered and documented. Ready to proceed to design phase.

---

## Next Steps

- [x] Finalize business requirements ✅
- [ ] Create design brief based on these requirements
- [ ] Design UI mockups for 5 key screens:
  - Recipe list view
  - Recipe creation/edit form
  - Weekly meal plan (vertical day cards)
  - Recipe picker modal (with servings stepper)
  - Shopping list (grouped by category with checkboxes)
- [ ] Define 3 seed recipes with variety
- [ ] Create keyword mapping for ingredient categorization
- [ ] Design demo week meal plan (which days get which recipes)

---

**Last Updated**: 2026-02-01
**Approved By**: Project Owner
**Ready for**: Design Phase
