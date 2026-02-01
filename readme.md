# Recipe Meal Planner - MVP

## Project Vision

A simple, elegant meal planning application that helps users save recipes, plan their weekly meals, and automatically generate shopping lists. This MVP is designed to prove market viability and attract investor interest by demonstrating core value with minimal complexity.

---

## Problem Statement

Home cooks struggle to organize their meal planning efficiently. They need a simple tool to:
- Keep their favorite recipes in one place
- Plan what to cook throughout the week
- Know exactly what groceries to buy

Currently, this requires juggling recipe cards, notes apps, and mental math to figure out shopping needs.

---

## Solution Overview

A web-based, mobile-friendly application with three core workflows:

1. **Save Recipes** - Store recipe details including ingredients and instructions
2. **Plan Meals** - Assign recipes to specific days and meal times in a weekly calendar
3. **Generate Shopping Lists** - Automatically aggregate ingredients from the week's planned meals

**Key Feature**: Smart ingredient aggregation combines duplicate items (e.g., "2 cups milk" + "1 cup milk" = "3 cups milk") to create efficient shopping lists.

---

## Target Users

**Primary**: Home cooks who meal prep or plan ahead  
**Secondary**: Busy professionals looking to simplify weeknight cooking  
**Demo Audience**: Potential investors evaluating market opportunity

---

## MVP Scope

### What's Included
- Create, edit, and delete recipes
- Plan meals on a 7-day calendar (breakfast, lunch, dinner)
- Auto-generate shopping lists from meal plans
- Check off items while shopping
- Mobile-responsive design
- Pre-seeded demo recipes for immediate demonstration

### What's NOT Included (Phase 2+)
- User accounts or authentication
- Recipe sharing between users
- Nutritional information
- Photos or images
- Recipe import from websites
- Grocery delivery integration
- Multi-week planning
- Data backup or export

---

## Technical Architecture

**Platform**: Web application (mobile-friendly responsive design)  
**Data Storage**: Browser localStorage (ephemeral)  
**State Management**: Client-side only, no backend required  
**Deployment**: Static hosting (e.g., GitHub Pages, Netlify, Vercel)

**Technology Stack**: TBD based on development team preferences  
*Recommended*: React or Angular for component-based UI, Tailwind for responsive styling

---

## Core Concepts

The application is built around three fundamental concepts:

1. **Recipe** - Storage of cooking instructions and ingredients
2. **Meal Plan** - Weekly organization of recipes
3. **Shopping List** - Aggregation of ingredients from planned meals

*See [docs/concepts.md](docs/concepts.md) for detailed concept analysis including purposes, operational principles, state, and actions.*

---

## User Flows

### Flow 1: Create and Save a Recipe
1. User clicks "Add Recipe"
2. Enters recipe name, ingredients (name/quantity/unit), and instructions
3. Optionally adds servings, prep time, cook time
4. Saves recipe to localStorage
5. Recipe appears in recipe list

### Flow 2: Plan a Week of Meals
1. User views weekly meal planning grid (7 days × 3 meals)
2. Clicks on a meal slot (e.g., "Monday Dinner")
3. Selects a recipe from saved recipes
4. Recipe is assigned to that meal slot
5. Repeat for other meals throughout the week

### Flow 3: Generate and Use Shopping List
1. User clicks "Generate Shopping List" from meal plan view
2. System aggregates all ingredients from planned recipes
3. Combines duplicate ingredients (summing quantities)
4. Displays organized shopping list
5. User checks off items while shopping

---

## Success Criteria

### For Investor Demo
- ✅ Polished, professional UI/UX
- ✅ Smooth mobile experience (thumb-friendly, fast)
- ✅ All three core workflows work flawlessly
- ✅ Demo data shows realistic use case (week of meals planned)
- ✅ "Wow factor" in ingredient aggregation (show intelligence)

### Technical Success
- ✅ Loads in < 2 seconds on mobile
- ✅ Works offline after initial load
- ✅ No bugs or broken features
- ✅ Responsive across phone, tablet, desktop

### User Experience
- ✅ Recipe creation: < 2 minutes
- ✅ Weekly meal planning: < 5 minutes
- ✅ Shopping list generation: Instant
- ✅ Intuitive without instructions

---

## Design Requirements

**Visual Style**: Clean, modern, approachable  
**Color Palette**: Food-friendly (warm, appetizing)  
**Typography**: Readable on mobile, scannable  
**Interactions**: Touch-friendly (44px+ tap targets)

**Key Screens**:
1. Recipe list view (card grid or list)
2. Recipe detail/edit form
3. Weekly meal planning grid/calendar
4. Shopping list view with checkboxes

*See [docs/design-brief.md](docs/design-brief.md) for detailed design specifications (to be created).*

---

## Project Timeline

**Phase 1**: Concept validation ✅ (Complete)  
**Phase 2**: Design & prototype (Est. 1 week)  
**Phase 3**: Development (Est. 2-3 weeks)  
**Phase 4**: Testing & polish (Est. 1 week)  
**Phase 5**: Investor demo prep (Est. 2-3 days)

**Total estimated time to MVP**: 4-5 weeks

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Ingredient aggregation logic complex | Medium | Start with simple exact-match, enhance later |
| Mobile UX challenging for meal grid | High | Design mobile-first, test early and often |
| Demo data feels fake | Medium | Create realistic, relatable recipes and plans |
| localStorage limits (~5-10MB) | Low | Monitor size, MVP unlikely to hit limits |

---

## Open Questions

*To be addressed in design phase:*

1. Recipe input: Manual form only, or support paste/import?
2. Meal planning interaction: Drag-and-drop or dropdown selection?
3. Shopping list organization: Flat list or grouped by category?
4. Recipe discovery: How do users find recipes to add to plan?

---

## Repository Structure
```
/
├── README.md                 # This file
├── docs/
│   ├── concepts.md          # Detailed concept analysis
│   ├── design-brief.md      # Design requirements (TBD)
│   └── user-flows.md        # Detailed user journey maps (TBD)
├── designs/
│   └── figma-links.md       # Links to design files (TBD)
└── src/                     # Application code (TBD)
```

---

## Contact & Feedback

**Project Owner**: [To be filled]  
**Last Updated**: 2026-02-01  
**Status**: Concept validation complete, moving to design phase

---

## Quick Links

- [Detailed Concepts](docs/concepts.md) - Core concept analysis
- Design Brief (coming soon)
- Issue Tracker (coming soon)
- Demo Link (coming soon)
