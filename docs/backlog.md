# Product Backlog - Recipe Meal Planner

*Generated from: reference-architecture.md*
*Date: 2026-02-01*
*Prioritization Strategy: Risk-Driven + Feedback-First*

---

## Backlog Principles

**Every work item (except Sprint 0) should:**
1. ✅ Deliver demoable value to the client
2. ✅ Go through all layers (Database → API → Frontend)
3. ✅ Be small enough to complete in 1-2 weeks
4. ✅ Provide feedback opportunity on UX, business logic, or technical approach

**Prioritization:**
1. **High Risk First** - Tackle uncertainty early (ingredient aggregation, fuzzy matching)
2. **Feedback Drivers** - Prioritize items where client validation is critical (UX flows, business rules)
3. **Dependencies** - Core features before dependent features
4. **Value** - MVP "wow factor" features early (smart aggregation)

---

## Epic Breakdown

| Epic | Priority | Risk Level | Stories | Est. Points |
|------|----------|------------|---------|-------------|
| Sprint 0: Infrastructure Setup | P0 | Low | 4 | 13 |
| Epic 1: Recipe Management (End-to-End) | P1 | Medium | 3 | 21 |
| Epic 2: Ingredient Aggregation (High Risk) | P2 | **High** | 3 | 21 |
| Epic 3: Meal Planning & Scaling | P3 | Medium | 4 | 26 |
| Epic 4: Shopping List Generation | P4 | Medium | 3 | 18 |
| Epic 5: Demo Polish & Seed Data | P5 | Low | 2 | 8 |
| **TOTAL** | | | **19** | **107** |

---

## Sprint 0: Infrastructure Setup
*Goal: Get development environment ready. These are NOT demoable but necessary.*

### S0-1: Development Environment Setup (3 points)
**Type**: Task
**Priority**: P0
**Risk**: Low

**Description:**
Set up local development environment for all developers.

**Acceptance Criteria:**
- [ ] .NET 8 SDK installed
- [ ] Node.js 20+ installed
- [ ] SQL Server 2022 LocalDB configured
- [ ] Visual Studio 2022 or VS Code setup
- [ ] Developer can run `dotnet --version` and `ng version`
- [ ] README updated with setup instructions

**Technical Notes:**
- Document in README.md or CONTRIBUTING.md
- Include troubleshooting section

---

### S0-2: Solution Structure & Projects (5 points)
**Type**: Task
**Priority**: P0
**Risk**: Low

**Description:**
Create Clean Architecture solution structure with all projects.

**Acceptance Criteria:**
- [ ] `MealPlanner.sln` created
- [ ] Projects created:
  - `MealPlanner.API` (ASP.NET Core 8 Web API)
  - `MealPlanner.Core` (Class library)
  - `MealPlanner.UseCases` (Class library)
  - `MealPlanner.Infrastructure` (Class library)
  - `MealPlanner.Database` (SQL Database Project)
  - `MealPlanner.API.Tests` (xUnit)
- [ ] Project references configured correctly
- [ ] Solution builds successfully
- [ ] Clean Architecture layers enforced (Core has no dependencies)

**Technical Notes:**
- Follow reference-architecture.md project structure
- Add StyleCop/analyzers for code quality

---

### S0-3: Database Project & Schema Foundation (3 points)
**Type**: Task
**Priority**: P0
**Risk**: Low

**Description:**
Create SQL Database Project and initial schema structure (empty tables, no data yet).

**Acceptance Criteria:**
- [ ] `MealPlanner.Database.sqlproj` created
- [ ] Folder structure: Tables/, Scripts/, StoredProcedures/
- [ ] Empty table definitions for:
  - Recipes
  - Ingredients
  - Instructions
  - MealPlans
  - MealPlanRecipes
- [ ] Database project builds successfully
- [ ] Can deploy to LocalDB

**Technical Notes:**
- Use exact schema from reference-architecture.md
- Tables can be empty (no constraints yet) - just structure
- Publish profile for LocalDB

---

### S0-4: Azure Infrastructure Provisioning (2 points)
**Type**: Task
**Priority**: P0
**Risk**: Low

**Description:**
Provision Azure resources for dev environment.

**Acceptance Criteria:**
- [ ] Resource group created: `rg-mealplanner-dev`
- [ ] Azure SQL Server created: `sql-mealplanner-dev`
- [ ] Azure SQL Database created: `db-mealplanner-dev` (Standard S0)
- [ ] Azure App Service created: `app-mealplanner-api-dev` (F1 tier)
- [ ] Azure App Service created: `app-mealplanner-frontend-dev` (F1 tier)
- [ ] Azure Key Vault created: `kv-mealplanner-dev`
- [ ] Application Insights created: `appi-mealplanner-dev`
- [ ] Connection strings stored in Key Vault
- [ ] Firewall rules configured for developer IPs

**Technical Notes:**
- Use Azure CLI or Portal
- Document resource names in reference-architecture.md
- Set up Managed Identity for App Services → Key Vault access

---

## Epic 1: Recipe Management (End-to-End)
*Goal: Prove the full-stack architecture works. Get feedback on basic UX.*
*Why First: Foundation for everything else. Lowest risk vertical slice.*

### E1-1: Create Recipe - Full Stack (8 points)
**Type**: User Story
**Priority**: P1
**Risk**: Medium (first full-stack feature)

**User Story:**
*As a home cook, I want to create a new recipe with ingredients and instructions, so I can save my favorite recipes.*

**Acceptance Criteria:**
- [ ] **Database**: Recipes, Ingredients, Instructions tables fully defined with constraints
- [ ] **API**: `POST /api/recipes` endpoint implemented
  - Validates name (required), ingredients (min 1), instructions (min 1)
  - Returns 201 Created with recipe ID
  - Returns 400 Bad Request with validation errors
- [ ] **Frontend**: Recipe form page working
  - Inline ingredient input (quantity, unit, name)
  - Inline instruction input
  - Client-side validation matches API
  - Success message on save
  - Navigates to recipe list after save
- [ ] **Demo**: Can create "Chicken Pasta" recipe and see it saved

**Technical Notes:**
- Use MediatR with CreateRecipeCommand
- EF Core repository pattern
- Frontend already exists (Angular app) - wire up API calls

**Demo Script:**
1. Open recipe form
2. Enter recipe name, 3 ingredients, 4 instructions
3. Save recipe
4. See success message
5. Verify recipe appears in list

**Feedback Questions for Client:**
- Is the inline ingredient form intuitive?
- Are the validation error messages clear?
- Is the required field indicator (*) obvious?

---

### E1-2: View Recipe List & Details (8 points)
**Type**: User Story
**Priority**: P1
**Risk**: Low

**User Story:**
*As a home cook, I want to see all my saved recipes in a list and view recipe details, so I can browse and reference my recipes.*

**Acceptance Criteria:**
- [ ] **API**: `GET /api/recipes` endpoint returns all recipes
- [ ] **API**: `GET /api/recipes/{id}` endpoint returns single recipe with ingredients & instructions
- [ ] **Frontend**: Recipe list displays all recipes
  - Shows name, servings, total time
  - Click card to view details
- [ ] **Frontend**: Recipe detail view shows:
  - Full ingredient list (with quantities)
  - Numbered instruction steps
  - Prep/cook times
  - Servings
- [ ] **Demo**: Can browse 3 seed recipes and view details

**Technical Notes:**
- Use GetRecipesQuery / GetRecipeByIdQuery
- Eager load Ingredients and Instructions (Include())
- Frontend already exists - wire up API

**Demo Script:**
1. Open recipe list
2. See 3 seed recipes
3. Click "Chicken Pasta"
4. View full recipe with ingredients and instructions

**Feedback Questions for Client:**
- Is the recipe list layout clear?
- Is recipe detail information organized well?
- Any missing information you'd want to see?

---

### E1-3: Edit Recipe (5 points)
**Type**: User Story
**Priority**: P1
**Risk**: Low

**User Story:**
*As a home cook, I want to edit an existing recipe to fix mistakes or update ingredients.*

**Acceptance Criteria:**
- [ ] **API**: `PUT /api/recipes/{id}` endpoint updates recipe
  - Replaces entire recipe (ingredients, instructions)
  - Validates same rules as create
  - Returns 200 OK with updated recipe
  - Returns 404 Not Found if recipe doesn't exist
- [ ] **Frontend**: Recipe form pre-populates when editing
  - Loads existing ingredients and instructions
  - Can add/remove/modify ingredients
  - Can add/remove/modify instructions
  - Save updates the recipe
- [ ] **Demo**: Can edit "Chicken Pasta" to change servings and add ingredient

**Technical Notes:**
- UpdateRecipeCommand replaces all child entities
- EF Core cascade delete for old ingredients/instructions
- Frontend already exists - wire up edit mode

**Demo Script:**
1. Click "Chicken Pasta" to view
2. Click "Edit" button
3. Change servings from 4 to 6
4. Add "1 tsp salt" ingredient
5. Save changes
6. Verify changes persisted

**Feedback Questions for Client:**
- Is the edit flow intuitive?
- Do you expect "Edit" to replace everything or merge?
- Should there be a "Cancel" confirmation if you've made changes?

---

## Epic 2: Ingredient Aggregation (High Risk)
*Goal: Implement the "wow factor" - smart ingredient aggregation with fractions and fuzzy matching.*
*Why Second: Highest technical risk. Need to validate approach early. Client needs to see it work.*

### E2-1: Basic Ingredient Aggregation (5 points)
**Type**: User Story
**Priority**: P2
**Risk**: **High** (complex logic)

**User Story:**
*As a home cook, I want duplicate ingredients to be combined in my shopping list, so I know the total amount to buy.*

**Acceptance Criteria:**
- [ ] **Backend**: Aggregation service created
  - Combines ingredients with exact same name (case-insensitive)
  - Combines ingredients with same unit
  - Sums quantities (decimal parsing: "2" + "1.5" = "3.5")
  - Returns aggregated list
- [ ] **Tests**: Unit tests for aggregation logic
  - Test: "2 cups milk" + "1 cup milk" = "3 cups milk"
  - Test: "2 cups flour" + "1 tbsp flour" = 2 separate items (different units)
  - Test: Case-insensitive: "Milk" + "milk" = combined
- [ ] **Demo**: Create shopping list from 2 recipes with duplicate ingredients

**Technical Notes:**
- Create `IngredientAggregationService` in UseCases
- Parse quantity as decimal (handle "2", "1.5", etc.)
- Unit must match exactly for combining
- Name must match case-insensitive

**Demo Script:**
1. Create Recipe A: "2 cups milk"
2. Create Recipe B: "1 cup milk"
3. Add both to meal plan
4. Generate shopping list
5. See "3 cups milk" (not two separate items)

**Feedback Questions for Client:**
- Does the aggregation behavior match your expectations?
- Should "Milk" and "milk" combine? (Yes, per current logic)
- Should "whole milk" and "milk" combine? (Next story)

**RISK**: If decimal parsing fails or edge cases found, may need extra story.

---

### E2-2: Fraction Support in Aggregation (8 points)
**Type**: User Story
**Priority**: P2
**Risk**: **High** (complex math)

**User Story:**
*As a home cook, I want fractional quantities to be added correctly (1/2 + 1/4 = 3/4), so my shopping list is accurate.*

**Acceptance Criteria:**
- [ ] **Backend**: Fraction parser implemented
  - Parses "1/2", "1/4", "2 1/2" (mixed fractions)
  - Converts to decimal for math
  - Sums fractions correctly
  - Displays result as decimal ("0.75 cups" or "3/4 cups")
- [ ] **Tests**: Unit tests for fraction math
  - Test: "1/2 cup" + "1/4 cup" = "0.75 cups" (or "3/4 cups")
  - Test: "2 1/2 cups" + "1 cup" = "3.5 cups"
  - Test: "1/3 cup" + "1/3 cup" = "0.67 cups" (rounded)
- [ ] **Demo**: Shopping list with fractions aggregates correctly

**Technical Notes:**
- Use Regex to parse fractions: `(\d+)?\s*(\d+)/(\d+)`
- Convert to decimal, sum, decide on display format (decimal vs fraction)
- Handle edge cases: "to taste", empty quantity

**Demo Script:**
1. Create Recipe A: "1/2 cup flour"
2. Create Recipe B: "1/4 cup flour"
3. Add both to meal plan
4. Generate shopping list
5. See "0.75 cups flour" or "3/4 cups flour"

**Feedback Questions for Client:**
- Do you prefer "3/4 cups" or "0.75 cups" display?
- How should "1/3 + 1/3" display? (0.67? 2/3?)
- What about "to taste" ingredients?

**RISK**: Fraction-to-decimal conversion complexity. May need spike/research story first.

---

### E2-3: Fuzzy Ingredient Matching (8 points)
**Type**: User Story
**Priority**: P2
**Risk**: **High** (ambiguous business rules)

**User Story:**
*As a home cook, I want similar ingredient names to be combined (e.g., "milk" and "whole milk"), so my shopping list isn't duplicated.*

**Acceptance Criteria:**
- [ ] **Backend**: Fuzzy matching algorithm implemented
  - "milk" matches "whole milk", "2% milk", "skim milk"
  - "onion" matches "yellow onion", "diced onion"
  - Uses base ingredient name for matching
- [ ] **Backend**: Ingredient category/synonym mapping
  - Define common ingredient variations
  - Client can review and approve mapping rules
- [ ] **Tests**: Unit tests for fuzzy matching
  - Test: "milk" + "whole milk" = combined
  - Test: "chicken" + "chicken breast" = combined
  - Test: "flour" + "bread flour" = separate (different types)
- [ ] **Demo**: Shopping list combines "milk" and "whole milk"

**Technical Notes:**
- Start with simple keyword extraction (remove modifiers)
- Alternative: Levenshtein distance or stemming
- May need client feedback on which ingredients should/shouldn't match

**Demo Script:**
1. Create Recipe A: "1 cup milk"
2. Create Recipe B: "1 cup whole milk"
3. Add both to meal plan
4. Generate shopping list
5. See "2 cups milk" (or "2 cups whole milk"?)

**Feedback Questions for Client:**
- Should "milk" and "whole milk" combine? (Yes per business-decisions.md)
- Should "flour" and "bread flour" combine? (Probably not)
- Should we show which ingredients were combined?
- What should the display name be? ("milk" vs "whole milk")

**RISK**: Business rules may be ambiguous. Need client workshop to define matching rules.

**RECOMMENDATION**: Do this story AFTER E2-1 and E2-2. Get client feedback first.

---

## Epic 3: Meal Planning & Scaling
*Goal: Core meal planning feature with recipe scaling.*
*Why Third: Depends on recipes existing. UX needs validation (recipe picker, scaling interaction).*

### E3-1: Create Weekly Meal Plan (5 points)
**Type**: User Story
**Priority**: P3
**Risk**: Medium

**User Story:**
*As a home cook, I want to create a weekly meal plan for dinners, so I can organize my week.*

**Acceptance Criteria:**
- [ ] **Database**: MealPlans and MealPlanRecipes tables fully defined
- [ ] **API**: `POST /api/mealplans` creates a plan for current week
  - Accepts week start date (Monday)
  - Creates empty plan with 7 day slots
  - Returns 201 Created with plan ID
- [ ] **API**: `GET /api/mealplans/current` returns current week's plan
- [ ] **Frontend**: Meal Plan page displays 7 vertical day cards
  - Monday-Sunday
  - Empty state: "Add Dinner" button on each day
- [ ] **Demo**: Can view empty meal plan for current week

**Technical Notes:**
- MealPlan has WeekStartDate (always Monday)
- MealPlanRecipes is join table (MealPlanId, RecipeId, DayOfWeek, Servings)
- Auto-create plan for current week if doesn't exist

**Demo Script:**
1. Navigate to Meal Plan page
2. See 7 day cards (Monday-Sunday)
3. All show "Add Dinner"
4. Verify current week dates displayed

**Feedback Questions for Client:**
- Is the vertical day card layout intuitive on mobile?
- Should week start on Sunday or Monday? (Monday per business-decisions.md)
- Do you want to see the date on each day card?

---

### E3-2: Assign Recipe to Meal Plan Day (8 points)
**Type**: User Story
**Priority**: P3
**Risk**: Medium (UX complexity)

**User Story:**
*As a home cook, I want to assign a recipe to a specific day, so I can plan what to cook each night.*

**Acceptance Criteria:**
- [ ] **API**: `PUT /api/mealplans/{id}/dinners/{day}` assigns recipe
  - Accepts recipeId and servings
  - Validates recipe exists
  - Creates/updates MealPlanRecipe entry
  - Returns 200 OK with updated plan
- [ ] **Frontend**: Recipe Picker Modal implemented
  - Opens when clicking "Add Dinner"
  - Shows all recipes as tappable cards (not radio buttons)
  - Displays recipe name, base servings, time
  - Close button (X)
- [ ] **Frontend**: Day card shows assigned recipe
  - Recipe name
  - Servings
  - "Change" and "Remove" buttons
- [ ] **Demo**: Can assign "Chicken Pasta" to Monday

**Technical Notes:**
- Modal slides up from bottom (mobile pattern)
- Recipe cards should be tappable (Pattern 7 from design-brief.md)
- No servings scaling yet (next story) - use recipe's base servings

**Demo Script:**
1. Click "Add Dinner" on Monday
2. See recipe picker modal with 3 recipes
3. Tap "Chicken Pasta"
4. Modal closes
5. Monday card shows "Chicken Pasta, 4 servings"

**Feedback Questions for Client:**
- Is the recipe picker easy to use?
- Should recipes show a preview of ingredients?
- Is the modal size appropriate on mobile?

---

### E3-3: Scale Recipe Servings in Meal Plan (8 points)
**Type**: User Story
**Priority**: P3
**Risk**: Medium (UI/UX)

**User Story:**
*As a home cook, I want to adjust recipe servings when adding to my meal plan, so I can cook the right amount.*

**Acceptance Criteria:**
- [ ] **Frontend**: Servings stepper added to Recipe Picker Modal
  - Position: Top of modal, above recipe list
  - Format: [-] 4 servings [+]
  - Min: 1, Max: 12
  - Default: Recipe's base servings
- [ ] **Frontend**: When recipe selected, uses stepper value for servings
- [ ] **API**: MealPlanRecipe stores scaled servings
- [ ] **Frontend**: Day card shows scaled servings
  - "Chicken Pasta (6 servings)" if scaled
- [ ] **Demo**: Can assign recipe and scale to different servings

**Technical Notes:**
- Stepper buttons: 50px × 50px (touch-friendly)
- Stepper updates state, doesn't call API until recipe selected
- Servings saved in MealPlanRecipes.Servings column

**Demo Script:**
1. Click "Add Dinner" on Monday
2. See servings stepper (default: 4)
3. Click [+] twice → servings = 6
4. Select "Chicken Pasta"
5. Monday card shows "Chicken Pasta (6 servings)"

**Feedback Questions for Client:**
- Is the stepper intuitive?
- Should default servings be recipe's base or always 4?
- Do you want to see original servings somewhere? ("Recipe serves 4, cooking for 6")

---

### E3-4: Remove Recipe from Meal Plan (5 points)
**Type**: User Story
**Priority**: P3
**Risk**: Low

**User Story:**
*As a home cook, I want to remove a recipe from a day if I change my mind.*

**Acceptance Criteria:**
- [ ] **API**: `DELETE /api/mealplans/{id}/dinners/{day}` removes recipe
  - Deletes MealPlanRecipe entry
  - Returns 204 No Content
- [ ] **Frontend**: "Remove" button on filled day card
  - Click removes recipe
  - Day card returns to "Add Dinner" state
  - No confirmation dialog (can always re-add)
- [ ] **Demo**: Can remove recipe from Monday

**Technical Notes:**
- No confirmation needed per design brief
- Soft delete vs hard delete? (Hard delete for MVP)

**Demo Script:**
1. Monday has "Chicken Pasta"
2. Click "Remove"
3. Monday card shows "Add Dinner" again

**Feedback Questions for Client:**
- Should there be a confirmation dialog?
- Should removed recipes be logged/tracked?

---

## Epic 4: Shopping List Generation
*Goal: Auto-generate shopping list from meal plan with categories.*
*Why Fourth: Depends on meal plan and aggregation logic.*

### E4-1: Generate Shopping List from Meal Plan (8 points)
**Type**: User Story
**Priority**: P4
**Risk**: Medium (integration)

**User Story:**
*As a home cook, I want to generate a shopping list from my meal plan, so I know what groceries to buy.*

**Acceptance Criteria:**
- [ ] **API**: `GET /api/shoppinglists/current` generates list
  - Reads current week's meal plan
  - Extracts all ingredients from assigned recipes
  - Scales ingredient quantities by servings
  - Aggregates duplicates (uses Epic 2 logic)
  - Returns ShoppingList DTO with aggregated items
- [ ] **Frontend**: Shopping List page displays items
  - Auto-loads on page visit
  - Shows aggregated ingredients
  - Checkboxes next to each item (unchecked by default)
- [ ] **Demo**: Meal plan with 2 recipes generates correct list

**Technical Notes:**
- Generate list on-the-fly (no persistence needed for MVP)
- Apply scaling: If recipe has "2 cups milk" for 4 servings, and meal plan says 6 servings, scale to 3 cups
- Use IngredientAggregationService from Epic 2

**Demo Script:**
1. Meal plan has "Chicken Pasta" (Monday, 4 servings) and "Veggie Stir Fry" (Wednesday, 2 servings)
2. Navigate to Shopping List
3. See all ingredients aggregated and scaled
4. Verify "2 cups pasta" (from Chicken Pasta) appears

**Feedback Questions for Client:**
- Should the list be generated live or cached?
- What happens if you change meal plan while shopping? (List reloads per business-decisions.md)
- Should we show which recipe each ingredient came from?

---

### E4-2: Categorize Shopping List Items (5 points)
**Type**: User Story
**Priority**: P4
**Risk**: Medium (categorization logic)

**User Story:**
*As a home cook, I want my shopping list grouped by category (Produce, Dairy, etc.), so I can shop efficiently.*

**Acceptance Criteria:**
- [ ] **Backend**: Categorization service created
  - Auto-detects category from ingredient name using keywords
  - Categories: Produce, Dairy, Meat & Seafood, Pantry, Other
  - Returns items grouped by category
- [ ] **Frontend**: Shopping list displays categories
  - Collapsible sections (▼/▶ icon)
  - Category header shows name + count
  - All categories expanded by default
- [ ] **Tests**: Unit tests for categorization
  - Test: "milk" → Dairy
  - Test: "chicken" → Meat & Seafood
  - Test: "onion" → Produce
  - Test: "flour" → Pantry
  - Test: "unknown-item" → Other
- [ ] **Demo**: Shopping list shows 3+ categories

**Technical Notes:**
- Keyword mapping per reference-architecture.md
- Simple string matching for MVP (can enhance later)
- Create `IngredientCategorizationService`

**Demo Script:**
1. Generate shopping list with diverse ingredients
2. See categories: Produce, Dairy, Meat, Pantry
3. Click category header to collapse/expand
4. Verify items grouped correctly

**Feedback Questions for Client:**
- Are the category names intuitive?
- Should we allow custom categories?
- Should categories have a specific order? (Produce first, Other last?)

---

### E4-3: Check Off Shopping List Items (5 points)
**Type**: User Story
**Priority**: P4
**Risk**: Low

**User Story:**
*As a home cook, I want to check off items as I shop, so I know what I've already grabbed.*

**Acceptance Criteria:**
- [ ] **Frontend**: Checkbox interaction implemented
  - Click checkbox → Item marked checked
  - Checked state: Strikethrough text, dimmed color
  - Click again → Unchecks
- [ ] **State**: Checked state persists in localStorage (frontend only)
  - Survives page refresh
  - Resets when week changes (per business-decisions.md)
- [ ] **Demo**: Can check/uncheck items while "shopping"

**Technical Notes:**
- localStorage key: `shopping_list_checked_items`
- Store array of ingredient names (or IDs)
- No backend persistence needed for MVP

**Demo Script:**
1. View shopping list
2. Check "2 cups milk"
3. See strikethrough and dimmed color
4. Refresh page
5. Verify "milk" still checked
6. Uncheck "milk"
7. Verify returns to normal state

**Feedback Questions for Client:**
- Should checked items move to bottom of list?
- Should there be a "Clear all checks" button?
- What happens on new week? (Clears per business-decisions.md)

---

## Epic 5: Demo Polish & Seed Data
*Goal: Make the demo impressive for investors.*
*Why Last: After all features work.*

### E5-1: Seed Data & Demo Week Setup (5 points)
**Type**: Task
**Priority**: P5
**Risk**: Low

**Description:**
Create realistic seed data and pre-populated demo week for investor presentations.

**Acceptance Criteria:**
- [ ] **Database**: `SeedData.sql` script created with 3 recipes:
  - Creamy Chicken Pasta (4 servings, 10 min prep, 20 min cook)
  - Quick Veggie Stir Fry (2 servings, 15 min prep, 10 min cook)
  - Hearty Lentil Soup (6 servings, 10 min prep, 35 min cook)
- [ ] All ingredients and instructions populated per design-brief.md
- [ ] **API**: Seed data loaded on first run (or via endpoint)
- [ ] **Frontend**: Demo week pre-populated:
  - Monday: Creamy Chicken Pasta (4 servings)
  - Wednesday: Quick Veggie Stir Fry (2 servings)
  - Friday: Hearty Lentil Soup (6 servings)
- [ ] **Frontend**: "Reset Demo" button implemented
  - Resets to original 3 recipes + demo week
  - Shows confirmation dialog

**Demo Script:**
1. Open app (fresh install)
2. See 3 seed recipes in list
3. Navigate to Meal Plan
4. See demo week already populated (M/W/F)
5. Navigate to Shopping List
6. See aggregated list from 3 recipes
7. Click "Reset Demo" button
8. Verify data resets

**Feedback Questions for Client:**
- Are the 3 seed recipes representative?
- Should we show more or fewer days pre-planned?

---

### E5-2: Mobile UX Polish & Performance (3 points)
**Type**: Task
**Priority**: P5
**Risk**: Low

**Description:**
Final polish for mobile experience and performance optimization.

**Acceptance Criteria:**
- [ ] All touch targets ≥ 44px × 44px
- [ ] Smooth animations (60fps)
- [ ] Loading states for API calls
- [ ] Error messages user-friendly
- [ ] Mobile keyboard triggers correctly (numeric for numbers, etc.)
- [ ] App works offline after initial load (service worker)
- [ ] Passes Lighthouse mobile audit (80+ score)
- [ ] Tested on iPhone and Android

**Demo Script:**
1. Open app on mobile device
2. Navigate through all pages
3. Verify smooth, no jank
4. Test in airplane mode (should work with localStorage)

**Feedback Questions for Client:**
- Does the app feel fast and responsive?
- Are there any confusing interactions?

---

## Backlog Summary

### Sprint Plan Suggestion

**Sprint 1 (2 weeks): Sprint 0 + Recipe Management**
- All Sprint 0 tasks (S0-1 to S0-4)
- E1-1: Create Recipe
- E1-2: View Recipe List & Details
- **Goal**: Prove full stack works, get feedback on basic UX

**Sprint 2 (2 weeks): Ingredient Aggregation (High Risk)**
- E1-3: Edit Recipe (finish Epic 1)
- E2-1: Basic Ingredient Aggregation
- E2-2: Fraction Support
- **Goal**: Tackle highest risk items, validate approach

**Sprint 3 (2 weeks): Fuzzy Matching + Meal Planning**
- E2-3: Fuzzy Ingredient Matching (high risk)
- E3-1: Create Weekly Meal Plan
- E3-2: Assign Recipe to Meal Plan
- **Goal**: Complete aggregation, start meal planning

**Sprint 4 (2 weeks): Meal Planning + Shopping List**
- E3-3: Scale Recipe Servings
- E3-4: Remove Recipe from Meal Plan
- E4-1: Generate Shopping List
- **Goal**: Core meal planning complete

**Sprint 5 (1 week): Shopping List + Polish**
- E4-2: Categorize Shopping List
- E4-3: Check Off Items
- E5-1: Seed Data & Demo Week
- E5-2: Mobile UX Polish
- **Goal**: Feature complete, demo ready

**Total Duration**: 9 weeks

---

## Risk Mitigation Strategy

### High-Risk Items (Tackle Early)

1. **E2-2: Fraction Support** (Sprint 2)
   - **Risk**: Complex math, edge cases
   - **Mitigation**: Spike/research story if needed, unit tests first
   - **Fallback**: Don't support fractions initially, only decimals

2. **E2-3: Fuzzy Matching** (Sprint 3)
   - **Risk**: Ambiguous business rules
   - **Mitigation**: Client workshop to define matching rules before sprint
   - **Fallback**: Exact matching only (case-insensitive)

3. **E3-2: Recipe Picker UX** (Sprint 3)
   - **Risk**: Mobile UX may be clunky
   - **Mitigation**: Prototype in Sprint 1 (low-fidelity), get feedback
   - **Fallback**: Dropdown instead of modal

### Feedback Checkpoints

**After Sprint 1:**
- Demo: Create/view/edit recipes
- Question: Is the recipe form workflow intuitive?

**After Sprint 2:**
- Demo: Ingredient aggregation with fractions
- Question: Does aggregation match expectations?

**After Sprint 3:**
- Demo: Fuzzy matching behavior
- Question: Which ingredients should/shouldn't combine?

**After Sprint 4:**
- Demo: Full meal planning with scaling
- Question: Is the scaling interaction clear?

**After Sprint 5:**
- Demo: Complete app with shopping list
- Question: Ready for investor demo?

---

## Definition of Done

Each user story is "Done" when:
- [ ] Code committed to main branch
- [ ] Unit tests written and passing (80%+ coverage)
- [ ] API endpoints documented (inline comments or README)
- [ ] Frontend UI matches design brief
- [ ] Tested on mobile (iOS and Android)
- [ ] Demoed to client and feedback captured
- [ ] No known bugs or blockers

---

## Notes

**Client Involvement:**
- Sprint 1, 2, 3, 4, 5: End-of-sprint demos
- Sprint 3: Workshop for fuzzy matching rules
- Sprint 5: Final investor demo dry run

**Technical Debt:**
- No authentication (Phase 2)
- No recipe deletion (Phase 2)
- No API versioning (Phase 2)
- No Swagger docs (Phase 2)

**Future Enhancements (Phase 2+):**
- Recipe sharing
- Nutritional info
- Recipe import from web
- Multi-week planning
- Breakfast/lunch support

---

**Last Updated**: 2026-02-01
**Total Story Points**: 107
**Estimated Duration**: 9 weeks (5 sprints)
