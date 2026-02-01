# Design Brief - Recipe Meal Planner MVP

*Generated from: [concepts.md](concepts.md) and [business-decisions.md](business-decisions.md)*
*Date: 2026-02-01*
*Status: Ready for Design Implementation*

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [User Flows](#user-flows)
3. [Screen Requirements](#screen-requirements)
4. [Interaction Patterns](#interaction-patterns)
5. [Mobile-First Considerations](#mobile-first-considerations)
6. [UI Components by Concept](#ui-components-by-concept)
7. [Visual Design System](#visual-design-system)
8. [Responsive Breakpoints](#responsive-breakpoints)
9. [Accessibility Requirements](#accessibility-requirements)

---

## Design Principles

**1. Mobile-First Everything**
- Design for thumb zones and one-handed use
- Touch targets minimum 44px × 44px
- Primary actions within easy thumb reach
- Minimize typing, maximize tapping

**2. Instant Feedback**
- No loading states for localStorage operations
- Immediate visual confirmation of actions
- Optimistic UI updates
- Clear success/error states

**3. Minimal Cognitive Load**
- One primary action per screen
- Clear visual hierarchy
- Consistent patterns across features
- Progressive disclosure of complexity

**4. Food-Friendly Aesthetics**
- Warm, appetizing color palette
- Clean, uncluttered layouts
- Readable typography for recipes
- Inviting, approachable tone

**5. Demo-Ready Polish**
- Pre-populated with realistic data
- Every interaction feels smooth
- No broken states or edge cases visible
- "Wow factor" in key features (ingredient aggregation, scaling)

---

## User Flows

### Flow 1: Create a New Recipe

**Trigger**: User taps "Add Recipe" button from Recipe List
**Goal**: Save a new recipe with ingredients and instructions

```
1. Recipe List Screen
   ↓ [Tap "Add Recipe" FAB]

2. Recipe Form Screen (empty)
   - Enter recipe name (required)
   - Tap "Add Ingredient"
     → Opens ingredient input
     → Enter name, quantity, unit (free-text)
     → Tap "Add"
     → Ingredient appears in list
   - Repeat for all ingredients (minimum 1)
   - Tap "Add Instruction"
     → Enter instruction text
     → Tap "Add"
     → Instruction appears in numbered list
   - Repeat for all instructions (minimum 1)
   - Optionally enter servings, prep time, cook time
   ↓ [Tap "Save Recipe"]

3. Recipe List Screen
   - New recipe appears in list
   - Success toast: "Recipe saved!"
```

**Edge Cases**:
- Validation: Require name + 1 ingredient + 1 instruction
- Cancel: Confirm if data entered
- Auto-save to localStorage on each field change (optional enhancement)

---

### Flow 2: Plan a Week of Dinners

**Trigger**: User views Meal Plan Screen
**Goal**: Assign recipes to specific days for dinner

```
1. Meal Plan Screen (7 vertical day cards)
   - Shows Monday-Sunday
   - Each card shows: Day name, current recipe (if any), or "Add Dinner"
   ↓ [Tap "Add Dinner" on a day card]

2. Recipe Picker Modal
   - Header: "Choose Dinner for [Day]"
   - Scrollable list of all recipes
   - Each recipe shows: Name, servings
   - Servings stepper at top: [-] 4 servings [+]
     → Adjusts servings for selected recipe
   ↓ [Tap on a recipe]

3. Meal Plan Screen
   - Modal closes
   - Day card now shows:
     → Recipe name
     → Scaled servings (if adjusted)
     → "Change" or "Remove" action
   - Shopping list auto-updates in background
```

**Edge Cases**:
- Empty state: No recipes yet → Show "Create a recipe first" prompt
- Changing recipe: Tap on filled day → Modal reopens with current recipe highlighted
- Removing recipe: Tap "Remove" → Confirms → Clears day slot
- Unplanned days: Valid and expected

---

### Flow 3: Use Shopping List While Shopping

**Trigger**: User navigates to Shopping List Screen
**Goal**: Check off items as they shop

```
1. Shopping List Screen (auto-generated from meal plan)
   - Grouped by category (Produce, Dairy, Meat, Pantry, Other)
   - Each category is collapsible section
   - Items show:
     → Checkbox (unchecked)
     → Ingredient name
     → Aggregated quantity + unit
   ↓ [Tap checkbox on an item]

2. Item marked as checked
   - Visual: Strikethrough text, dimmed color
   - Checkbox fills with checkmark
   - Item moves to bottom of category (optional)
   ↓ [Continue checking items]

3. All items checked
   - Optional celebration: "All done! 🎉"
   - List persists until week changes
```

**Edge Cases**:
- Empty list: No meals planned → Show "Plan some meals first"
- Unchecking items: Tap checked item → Unchecks
- Week reset: New week → List clears, checkmarks reset
- No quantity items: "Salt" (just name, no amount)

---

### Flow 4: Scale Recipe When Planning

**Trigger**: User is in Recipe Picker Modal
**Goal**: Adjust servings before assigning to day

```
1. Recipe Picker Modal
   - Servings stepper visible at top
   - Default: Recipe's base servings (e.g., 4)
   ↓ [Tap minus button]

2. Servings decrease by 1
   - Number updates: 4 → 3
   - No visual indication on recipe list yet
   ↓ [Tap recipe to select]

3. Recipe assigned with scaled servings
   - Day card shows: "Chicken Pasta (3 servings)"
   - Shopping list quantities auto-scale
     → Base recipe: "2 cups milk" for 4 servings
     → Scaled: "1.5 cups milk" for 3 servings
```

**Edge Cases**:
- Minimum servings: 1 (minus button disables at 1)
- Maximum servings: 12 (plus button disables at 12)
- Fraction quantities: Display "1.5 cups" not "1 1/2 cups"

---

### Flow 5: Reset to Demo Data

**Trigger**: User taps "Reset Demo" button (in settings/menu)
**Goal**: Restore original 3 seed recipes and demo week

```
1. Any Screen
   ↓ [Tap "Reset Demo" in menu]

2. Confirmation Dialog
   - "Reset to demo data? This will delete your recipes and meal plan."
   - [Cancel] [Reset]
   ↓ [Tap "Reset"]

3. Data restored
   - 3 seed recipes loaded
   - Demo week meal plan restored
   - Shopping list regenerated
   - Returns to Meal Plan Screen
   - Success toast: "Demo data restored"
```

---

## Screen Requirements

### Screen 1: Recipe List

**Purpose**: Browse all saved recipes, entry point to create new recipe

**Layout**:
```
┌─────────────────────────┐
│ Recipe Meal Planner     │ ← Header
├─────────────────────────┤
│                         │
│  ┌──────────────────┐   │
│  │ Chicken Pasta    │   │ ← Recipe Card
│  │ 4 servings       │   │
│  │ 30 min total     │   │
│  └──────────────────┘   │
│                         │
│  ┌──────────────────┐   │
│  │ Veggie Stir Fry  │   │
│  │ 2 servings       │   │
│  │ 20 min total     │   │
│  └──────────────────┘   │
│                         │
│  ┌──────────────────┐   │
│  │ Lentil Soup      │   │
│  │ 6 servings       │   │
│  │ 45 min total     │   │
│  └──────────────────┘   │
│                         │
├─────────────────────────┤
│     [+ Add Recipe]      │ ← FAB (Floating Action Button)
└─────────────────────────┘
│ [Recipes] [Plan] [Shop] │ ← Bottom Navigation
```

**Components**:
- Header with app title
- Scrollable list of recipe cards
- Recipe card shows: Name, servings, total time (if available)
- FAB: Primary action to create recipe
- Bottom navigation: 3 tabs (Recipes, Plan, Shopping List)
- Empty state: "No recipes yet. Create your first one!"

**Interactions**:
- Tap recipe card → Navigate to Recipe Detail/Edit Screen
- Tap FAB → Navigate to Recipe Form Screen
- Scroll to browse recipes

**Mobile Considerations**:
- Cards full-width with padding
- Minimum card height: 80px
- FAB positioned in thumb zone (bottom-right)
- List scrolls smoothly (momentum scrolling)

---

### Screen 2: Recipe Form (Create/Edit)

**Purpose**: Create new recipe or edit existing recipe

**Layout**:
```
┌─────────────────────────┐
│ [<] New Recipe   [Save] │ ← Header with back and save
├─────────────────────────┤
│                         │
│ Recipe Name             │
│ ┌─────────────────────┐ │
│ │ Chicken Pasta       │ │ ← Text input
│ └─────────────────────┘ │
│                         │
│ Servings (optional)     │
│ ┌─────────────────────┐ │
│ │ 4                   │ │
│ └─────────────────────┘ │
│                         │
│ Ingredients             │
│ ┌─────────────────────┐ │
│ │ • 2 cups pasta      │ │ ← Ingredient list
│ │ • 1 lb chicken      │ │
│ │ • 1 cup milk        │ │
│ └─────────────────────┘ │
│ [+ Add Ingredient]      │
│                         │
│ Instructions            │
│ ┌─────────────────────┐ │
│ │ 1. Boil pasta       │ │ ← Numbered list
│ │ 2. Cook chicken     │ │
│ │ 3. Combine with...  │ │
│ └─────────────────────┘ │
│ [+ Add Step]            │
│                         │
│ Prep Time (optional)    │
│ ┌─────────────────────┐ │
│ │ 10 minutes          │ │
│ └─────────────────────┘ │
│                         │
│ Cook Time (optional)    │
│ ┌─────────────────────┐ │
│ │ 20 minutes          │ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘
```

**Components**:
- Header: Back button, title, Save button
- Text inputs: Recipe name (required)
- Number input: Servings (optional)
- Ingredient list with add/remove
- **Ingredient input inline**: Quantity, Unit, Name fields (all free-text)
- Instruction list with add/remove
- Instruction input: Multi-line text (inline)
- Time inputs: Prep time, Cook time (optional)

**Interactions**:
- Tap "Add Ingredient" → **Inline form expands below button**
  - Enter: Quantity, Unit, Ingredient name (3 text fields in a row or stacked)
  - Tap "Add" → Adds to list, form clears for next ingredient
- Tap "Add Step" → Inline text area appears
  - Enter instruction text
  - Tap "Add" → Adds to numbered list
- Tap ingredient/instruction → Inline edit mode
- Swipe left on item → Delete (or tap trash icon)
- Tap "Save" → Validates → Saves to localStorage → Returns to list

**Validation**:
- Recipe name: Required, show error if empty
- Ingredients: Minimum 1 required
- Instructions: Minimum 1 required
- Show validation errors on Save attempt

**Mobile Considerations**:
- Keyboard-friendly: Inputs trigger appropriate keyboards
- Auto-capitalize recipe names, ingredient names
- Numeric keyboard for quantities, times
- Save button always visible (sticky header or footer)

---

### Screen 3: Meal Plan (7-Day Dinner View)

**Purpose**: View and manage weekly dinner plan

**Layout**:
```
┌─────────────────────────┐
│ This Week's Dinners     │ ← Header
│ [Reset Demo]            │ ← Optional menu action
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ MONDAY              │ │ ← Day Card (filled)
│ │ Chicken Pasta       │ │
│ │ 4 servings          │ │
│ │ [Change] [Remove]   │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ TUESDAY             │ │ ← Day Card (empty)
│ │ [+ Add Dinner]      │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ WEDNESDAY           │ │ ← Day Card (filled)
│ │ Veggie Stir Fry     │ │
│ │ 2 servings          │ │
│ │ [Change] [Remove]   │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ THURSDAY            │ │
│ │ [+ Add Dinner]      │ │
│ └─────────────────────┘ │
│                         │
│ ... (Friday-Sunday)     │
│                         │
└─────────────────────────┘
│ [Recipes] [Plan] [Shop] │ ← Bottom Navigation
```

**Components**:
- Header with week label
- 7 vertical day cards (Monday-Sunday)
- Day card states:
  - Empty: Day name + "Add Dinner" button
  - Filled: Day name + Recipe name + Servings + Actions
- Actions: "Change" and "Remove" buttons (or icons)
- Optional: Week navigation (future enhancement)

**Interactions**:
- Tap "Add Dinner" → Opens Recipe Picker Modal
- Tap "Change" → Opens Recipe Picker Modal (current recipe highlighted)
- Tap "Remove" → Removes recipe from day (no confirmation for MVP)
- Cards are tappable (entire card acts as "Change" button)

**Mobile Considerations**:
- Cards stack vertically (no horizontal scrolling)
- Card height: ~100px for filled, ~80px for empty
- Clear visual distinction between filled/empty states
- Touch-friendly action buttons

---

### Screen 4: Recipe Picker Modal

**Purpose**: Select a recipe and adjust servings for a specific day

**Layout**:
```
┌─────────────────────────┐
│ [X] Dinner for Monday   │ ← Modal header with close
├─────────────────────────┤
│                         │
│ Servings                │
│ ┌───────────────────┐   │
│ │  [-]   4   [+]    │   │ ← Stepper
│ └───────────────────┘   │
│                         │
│ Choose Recipe           │
│ ┌─────────────────────┐ │
│ │ Chicken Pasta       │ │ ← Tappable card
│ │ 4 servings • 30 min │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Veggie Stir Fry     │ │ ← Tappable card
│ │ 2 servings • 25 min │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Lentil Soup         │ │ ← Tappable card
│ │ 6 servings • 45 min │ │
│ └─────────────────────┘ │
│                         │
│ [Create New Recipe]     │ ← Quick action
│                         │
└─────────────────────────┘
```

**Components**:
- Modal overlay (dims background)
- Header: Day context + Close button
- Servings stepper: [-] number [+]
- **Scrollable recipe cards (tappable, not radio buttons)**
- Each card shows: Recipe name, base servings, total time
- Cards have elevation/shadow for tappable appearance
- "Create New Recipe" link at bottom
- Empty state: "No recipes yet. Create one first."

**Interactions**:
- Tap [+] → Increment servings (max 12)
- Tap [-] → Decrement servings (min 1)
- **Tap recipe card → Selects recipe → Modal closes → Day updates**
- Tap [X] or outside modal → Closes without saving
- Tap "Create New Recipe" → Opens Recipe Form, then returns here
- **Tap feedback**: Card scales slightly or changes background color on press

**Mobile Considerations**:
- Modal slides up from bottom (mobile pattern)
- Height: 70% of viewport
- Scrollable recipe list inside modal
- Large, touch-friendly stepper buttons (50px × 50px)
- **Recipe cards**: Full-width, min-height 60px, 12px gap between cards
- **Active state**: Visual feedback on tap (scale or color change)

---

### Screen 5: Shopping List

**Purpose**: View and check off ingredients grouped by category

**Layout**:
```
┌─────────────────────────┐
│ Shopping List           │ ← Header
├─────────────────────────┤
│                         │
│ ▼ Produce           3/5 │ ← Category header (collapsible)
│ ☐ 2 onions              │ ← Unchecked item
│ ☑ 1 lb carrots          │ ← Checked item (dimmed)
│ ☐ 3 bell peppers        │
│                         │
│ ▼ Dairy             1/2 │
│ ☐ 3 cups milk           │
│ ☑ 1 cup cheese          │
│                         │
│ ▼ Meat & Seafood    0/1 │
│ ☐ 2 lbs chicken breast  │
│                         │
│ ▼ Pantry            2/4 │
│ ☑ 4 cups pasta          │
│ ☐ 2 tbsp olive oil      │
│ ☑ Salt                  │ ← No quantity ("to taste")
│ ☐ 1 tsp black pepper    │
│                         │
│ ▼ Other             0/1 │
│ ☐ 2 cups vegetable broth│
│                         │
└─────────────────────────┘
│ [Recipes] [Plan] [Shop] │ ← Bottom Navigation
```

**Components**:
- Header with list title
- Category sections (collapsible)
- Category header shows: Name + progress (checked/total)
- Checkbox items: Quantity + Unit + Ingredient name
- Checked items: Strikethrough + dimmed color
- Empty state: "No dinners planned yet. Plan your week!"

**Categories** (auto-detected by keywords):
- Produce: vegetables, fruits
- Dairy: milk, cheese, butter, yogurt
- Meat & Seafood: chicken, beef, pork, fish, shrimp
- Pantry: flour, sugar, salt, pepper, oil, spices, pasta, rice
- Other: anything unmatched

**Interactions**:
- Tap checkbox → Toggles checked state
- Tap category header → Collapse/expand section
- Auto-updates when meal plan changes
- Items stay in place when checked (no re-sorting for MVP)

**Mobile Considerations**:
- Large checkboxes (44px tap target)
- Full-width item rows
- Clear visual hierarchy (category > items)
- Smooth collapse/expand animations

---

## Interaction Patterns

### Pattern 1: Modal Overlays
**Use Case**: Recipe Picker, Confirmation Dialogs

**Mobile Behavior**:
- Slide up from bottom (not center popup)
- Semi-transparent backdrop (dims background)
- Tap outside or swipe down to dismiss
- Clear close button in header

**Rationale**: Bottom sheets are more thumb-friendly on mobile

**Note**: Ingredient input uses inline pattern, not modal

---

### Pattern 2: Stepper Controls
**Use Case**: Servings adjustment

**Design**:
- Horizontal layout: [-] [Number] [+]
- Large buttons: 50px × 50px minimum
- Number display: 24px font, centered
- Disabled state: Gray out button at min/max

**Rationale**: Touch-friendly, familiar pattern, no keyboard needed

---

### Pattern 3: Collapsible Sections
**Use Case**: Shopping list categories, ingredient/instruction lists

**Design**:
- Header: Category name + icon (▼/▶) + count
- Tap anywhere on header to toggle
- Smooth animation (200ms ease)
- Default: All expanded

**Rationale**: Reduces scrolling, organizes content

---

### Pattern 4: Floating Action Button (FAB)
**Use Case**: Primary actions (Add Recipe)

**Design**:
- Position: Bottom-right, 16px margin
- Size: 56px diameter
- Icon: + symbol, white on primary color
- Shadow: Elevated appearance
- Fixed position (doesn't scroll)

**Rationale**: Thumb-zone placement, clear primary action

---

### Pattern 5: Inline Add/Edit
**Use Case**: Adding ingredients, instructions

**Design**:
- "Add" button below list
- **Tap → Inline form expands below button** (not modal)
- Enter data → Tap "Add" → Appends to list, form clears
- Edit: Tap item → Inline edit mode
- Form fields arranged horizontally (if space) or stacked vertically

**Rationale**: Keeps user in context, minimizes navigation, faster than modal flow

**Example** (Ingredient input):
```
[Quantity] [Unit] [Name] [Add]
  2 cups    cups   pasta   [+]
```

---

### Pattern 6: Swipe Actions
**Use Case**: Delete ingredient, delete instruction (optional)

**Design**:
- Swipe left → Reveals delete button (red)
- Tap delete → Removes item
- Alternative: Trash icon on each item

**Rationale**: Space-efficient, common mobile pattern

---

### Pattern 7: Tappable Cards
**Use Case**: Recipe picker, recipe list, day cards

**Design**:
- Full-width cards with elevation/shadow
- Minimum height: 60px
- Clear tap target (entire card)
- Active state: Scale (0.98) or background color change
- Visual feedback on press (150ms transition)
- Content: Title (bold), metadata (muted, smaller)

**Rationale**: More intuitive than radio buttons, better for touch, shows more information

**Example**:
```
┌─────────────────────────┐
│ Chicken Pasta           │ ← Bold, 18px
│ 4 servings • 30 min     │ ← Muted, 14px
└─────────────────────────┘
```

---

## Mobile-First Considerations

### Touch Targets
- Minimum size: 44px × 44px (WCAG AAA)
- Spacing: 8px minimum between targets
- Buttons: 48px height minimum
- Icon buttons: 44px × 44px

### Thumb Zones
- Primary actions: Bottom third of screen
- FAB: Bottom-right corner
- Navigation: Bottom of screen (tab bar)
- Avoid: Top corners (hard to reach)

### Scrolling
- Vertical scroll only (no horizontal)
- Momentum scrolling enabled
- Scroll containers clearly defined
- Pull-to-refresh (future enhancement)

### Keyboards
- Inputs trigger appropriate keyboards:
  - Text: Default keyboard with auto-capitalize
  - Numbers: Numeric keyboard
  - Time: Numeric keyboard with decimal
- "Done" or "Next" buttons visible
- Inputs scroll into view when keyboard opens

### Viewport
- Design for: 375px width (iPhone SE baseline)
- Test on: 320px (small), 375px (medium), 414px (large)
- Max-width: 600px (tablet switches to desktop layout)

### Performance
- Instant feedback (localStorage is fast)
- No loading spinners needed
- Optimistic UI updates
- Smooth 60fps animations

---

## UI Components by Concept

### Concept 1: Recipe

**Components Needed**:

1. **Recipe Card** (list view)
   - Recipe name (bold, 18px)
   - Servings (14px, muted)
   - Total time (14px, muted)
   - Tap target: Full card

2. **Recipe Form** (create/edit)
   - Text input: Recipe name
   - Number input: Servings, Prep time, Cook time
   - Ingredient list with add/remove
   - Instruction list with add/remove
   - Save button (primary CTA)

3. **Ingredient Input** (inline)
   - **Expands below "Add Ingredient" button**
   - Text input: Quantity (free-text, allows fractions)
   - Text input: Unit (free-text)
   - Text input: Ingredient name
   - Add button → Adds to list and clears form

4. **Instruction Input** (inline)
   - **Expands below "Add Step" button**
   - Multi-line text area
   - Auto-numbering
   - Add button → Adds to list and clears form

**Key Interactions**:
- Create: FAB → Form → Save → List
- Edit: Card → Form → Save → List
- Delete: Not supported in MVP

---

### Concept 2: Meal Plan

**Components Needed**:

1. **Day Card** (empty state)
   - Day name (caps, bold)
   - "Add Dinner" button
   - Tap target: Full card

2. **Day Card** (filled state)
   - Day name (caps, bold)
   - Recipe name (18px)
   - Servings indicator (14px, muted)
   - "Change" and "Remove" buttons (or icons)

3. **Recipe Picker Modal**
   - Modal header with day context
   - Servings stepper ([-] number [+])
   - **Scrollable recipe cards (tappable, not radio buttons)**
   - Each card shows: Recipe name, servings, time
   - Close button

4. **Servings Stepper**
   - Minus button ([-])
   - Number display (current servings)
   - Plus button ([+])
   - Min: 1, Max: 12

**Key Interactions**:
- Add: Day card → Modal → Select recipe → Day updates
- Change: Day card → Modal (current highlighted) → Select → Update
- Remove: "Remove" button → Clears day
- Scale: Stepper → Adjusts servings → Affects shopping list

---

### Concept 3: Shopping List

**Components Needed**:

1. **Category Section**
   - Category header (collapse/expand)
   - Progress indicator (3/5 checked)
   - Chevron icon (▼/▶)

2. **Shopping List Item**
   - Checkbox (44px tap target)
   - Quantity + Unit + Ingredient name
   - Checked state: Strikethrough, dimmed

3. **Empty State**
   - Illustration or icon
   - Message: "No dinners planned yet"
   - CTA: "Plan Your Week" → Goes to Meal Plan

**Key Interactions**:
- Check: Tap checkbox → Toggles state → Visual update
- Collapse: Tap category header → Collapses section
- Auto-update: Meal plan changes → List regenerates

**Aggregation Display**:
- Same ingredient, same unit: "3 cups milk" (2 cups + 1 cup)
- Same ingredient, different unit: Show separately
- Fractional results: "1.5 cups flour" (not "1 1/2")
- No quantity: "Salt" (from "to taste")

---

## Visual Design System

### Color Palette

**Primary Colors** (food-friendly, warm):
- Primary: `#FF6B35` (Coral orange) - CTAs, FAB, headers
- Primary Dark: `#CC5529` (Darker coral) - Active states
- Primary Light: `#FFA07A` (Light coral) - Backgrounds

**Neutral Colors**:
- Background: `#FAFAFA` (Off-white)
- Surface: `#FFFFFF` (White cards)
- Text Primary: `#212121` (Near-black)
- Text Secondary: `#757575` (Gray)
- Divider: `#E0E0E0` (Light gray)

**Semantic Colors**:
- Success: `#4CAF50` (Green) - Checkmarks, confirmations
- Error: `#F44336` (Red) - Validation errors, delete
- Info: `#2196F3` (Blue) - Informational messages

**Category Colors** (for shopping list):
- Produce: `#8BC34A` (Light green)
- Dairy: `#FFC107` (Amber)
- Meat: `#FF5722` (Deep orange)
- Pantry: `#795548` (Brown)
- Other: `#9E9E9E` (Gray)

---

### Typography

**Font Family**:
- Primary: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- Fallback: System fonts for performance

**Type Scale**:
- H1 (Screen titles): 24px, bold, letter-spacing: -0.5px
- H2 (Section headers): 20px, semi-bold
- H3 (Card titles): 18px, semi-bold
- Body: 16px, regular, line-height: 1.5
- Small: 14px, regular (metadata, labels)
- Caption: 12px, regular (hints, helper text)

**Readability**:
- Recipe instructions: 16px, line-height: 1.6
- Ingredient lists: 16px, line-height: 1.5
- Minimum body text: 16px (mobile best practice)

---

### Spacing System

**Base Unit**: 8px

- xs: 4px (tight spacing)
- sm: 8px (default spacing)
- md: 16px (comfortable spacing)
- lg: 24px (section spacing)
- xl: 32px (major sections)
- xxl: 48px (screen padding)

**Card Padding**: 16px
**Screen Padding**: 16px (mobile), 24px (tablet+)
**Gap Between Cards**: 12px

---

### Elevation (Shadows)

**Level 1** (Cards):
```css
box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
```

**Level 2** (Modal backdrop):
```css
box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
```

**Level 3** (FAB):
```css
box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
```

---

### Border Radius

- Small: 4px (buttons, inputs)
- Medium: 8px (cards)
- Large: 12px (modals)
- Pill: 24px (tags, chips)
- Circle: 50% (FAB, avatars)

---

### Iconography

**Icon Set**: Material Icons or Feather Icons (consistent, open-source)

**Icon Sizes**:
- Small: 16px (inline icons)
- Medium: 24px (buttons, lists)
- Large: 32px (empty states, headers)

**Common Icons**:
- Add: Plus (+) or Add Circle
- Remove: Minus (-) or Remove Circle
- Delete: Trash can
- Edit: Pencil
- Close: X or Close
- Check: Checkmark
- Chevron: Down/Right arrows
- Menu: Hamburger (☰)

---

## Responsive Breakpoints

### Mobile (Default)
**Range**: 320px - 599px
**Layout**: Single column, vertical stacking, bottom navigation

**Characteristics**:
- Full-width cards
- Vertical day cards
- Bottom sheet modals
- FAB bottom-right
- Tab bar navigation

---

### Tablet
**Range**: 600px - 959px
**Layout**: Transitional, some multi-column

**Characteristics**:
- Recipe list: 2 columns
- Meal plan: 2 columns (3-4 days per row)
- Shopping list: Single column (max-width 600px)
- Side navigation (optional)

---

### Desktop (Future)
**Range**: 960px+
**Layout**: Multi-column, sidebar navigation

**Characteristics**:
- Side navigation panel
- Recipe list: 3 columns
- Meal plan: Horizontal week view (7 columns)
- Shopping list: Side panel or max-width 600px centered

**Note**: Desktop is post-MVP, but design should consider it

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

**Color Contrast**:
- Text: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1
- UI components: Minimum 3:1

**Touch Targets**:
- Minimum: 44px × 44px
- Spacing: 8px between targets

**Keyboard Navigation** (desktop):
- All interactive elements focusable
- Tab order logical
- Focus indicators visible (outline)
- Enter/Space activates buttons

**Screen Readers**:
- Semantic HTML (headings, lists, buttons)
- ARIA labels where needed
- Alt text for icons (or aria-hidden)
- Live regions for dynamic updates (shopping list, meal plan)

**Forms**:
- Label every input
- Error messages linked to inputs
- Required fields indicated
- Validation errors clear and actionable

---

## Demo Data Specification

### Seed Recipe 1: Chicken Pasta

```
Name: Creamy Chicken Pasta
Servings: 4
Prep Time: 10 minutes
Cook Time: 20 minutes

Ingredients:
- 2 cups pasta
- 1 lb chicken breast
- 1 cup heavy cream
- 2 cloves garlic
- 1/2 cup parmesan cheese
- 2 tbsp olive oil
- Salt (to taste)
- Black pepper (to taste)

Instructions:
1. Boil pasta according to package directions.
2. Season and cook chicken in olive oil until golden brown.
3. Add garlic and cook until fragrant.
4. Pour in heavy cream and bring to a simmer.
5. Add parmesan cheese and stir until melted.
6. Combine pasta with sauce and serve.
```

### Seed Recipe 2: Veggie Stir Fry

```
Name: Quick Veggie Stir Fry
Servings: 2
Prep Time: 15 minutes
Cook Time: 10 minutes

Ingredients:
- 2 cups mixed vegetables (bell peppers, broccoli, carrots)
- 1/4 cup soy sauce
- 2 tbsp sesame oil
- 2 cloves garlic
- 1 tbsp ginger
- 2 cups cooked rice
- 1 tbsp cornstarch

Instructions:
1. Heat sesame oil in a large pan or wok.
2. Add garlic and ginger, stir for 30 seconds.
3. Add vegetables and stir fry for 5-7 minutes.
4. Mix soy sauce with cornstarch and add to pan.
5. Cook until sauce thickens.
6. Serve over rice.
```

### Seed Recipe 3: Lentil Soup

```
Name: Hearty Lentil Soup
Servings: 6
Prep Time: 10 minutes
Cook Time: 35 minutes

Ingredients:
- 2 cups lentils
- 1 onion (diced)
- 2 carrots (diced)
- 2 celery stalks (diced)
- 4 cups vegetable broth
- 2 cups water
- 2 tbsp olive oil
- 1 tsp cumin
- Salt (to taste)
- Black pepper (to taste)

Instructions:
1. Heat olive oil in a large pot.
2. Sauté onion, carrots, and celery until softened.
3. Add lentils, broth, water, and cumin.
4. Bring to a boil, then reduce heat and simmer for 30 minutes.
5. Season with salt and pepper.
6. Serve hot with crusty bread.
```

### Demo Week Meal Plan

- **Monday**: Creamy Chicken Pasta (4 servings)
- **Tuesday**: (empty)
- **Wednesday**: Quick Veggie Stir Fry (2 servings)
- **Thursday**: (empty)
- **Friday**: Hearty Lentil Soup (6 servings)
- **Saturday**: (empty)
- **Sunday**: (empty)

---

## Implementation Notes

### localStorage Structure

**Schema**:
```json
{
  "recipes": [
    {
      "id": "uuid",
      "name": "Chicken Pasta",
      "servings": 4,
      "ingredients": [
        {"quantity": "2", "unit": "cups", "name": "pasta"},
        {"quantity": "1", "unit": "lb", "name": "chicken breast"}
      ],
      "instructions": ["Step 1", "Step 2"],
      "prepTime": 10,
      "cookTime": 20
    }
  ],
  "mealPlan": {
    "weekStart": "2026-02-03",
    "dinners": {
      "0": {"recipeId": "uuid", "servings": 4},
      "2": {"recipeId": "uuid", "servings": 2}
    }
  },
  "shoppingList": {
    "items": [
      {
        "category": "Produce",
        "name": "onion",
        "quantity": 3,
        "unit": "whole",
        "checked": false
      }
    ],
    "generatedDate": "2026-02-01"
  }
}
```

### Ingredient Categorization Keywords

**Produce**:
- Vegetables: onion, garlic, carrot, celery, bell pepper, broccoli, tomato
- Fruits: apple, banana, lemon, lime, orange

**Dairy**:
- milk, cream, cheese, butter, yogurt, sour cream

**Meat & Seafood**:
- chicken, beef, pork, turkey, fish, shrimp, salmon

**Pantry**:
- pasta, rice, flour, sugar, salt, pepper, oil, vinegar, soy sauce
- Spices: cumin, paprika, oregano, basil, thyme

**Default**: Other

---

## Next Steps

1. **Wireframing** (Week 1)
   - Create low-fidelity wireframes for 5 screens
   - User flow diagrams
   - Interaction prototypes

2. **Visual Design** (Week 2)
   - Apply color palette and typography
   - Design all component states (default, hover, active, disabled)
   - Create icon set
   - Design empty states and error states

3. **Prototype** (Week 2-3)
   - High-fidelity interactive prototype (Figma)
   - Test key flows (create recipe, plan week, shopping)
   - Validate mobile interactions

4. **Design System** (Week 3)
   - Component library
   - Style guide documentation
   - Design tokens (colors, spacing, typography)

5. **Handoff** (End of Week 3)
   - Annotated designs for developers
   - Asset export (icons, images)
   - Implementation notes

---

**Last Updated**: 2026-02-01
**Status**: Ready for wireframing
**Approved By**: Project Owner
