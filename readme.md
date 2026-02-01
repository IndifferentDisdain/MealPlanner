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
- Create and edit recipes (no deletion in MVP)
- Plan **dinners** on a 7-day calendar (Monday-Sunday)
- Scale recipe servings when adding to meal plan
- Auto-updating shopping lists from meal plans (grouped by category)
- Check off items while shopping
- Mobile-responsive design (vertical day cards)
- 3 pre-seeded demo recipes for immediate demonstration
- Reset to demo data button

### What's NOT Included (Phase 2+)
- User accounts or authentication
- Recipe sharing between users
- Nutritional information
- Photos or images
- Recipe import from websites
- Grocery delivery integration
- Multi-week planning
- Data backup or export
- Breakfast and lunch planning (dinner only for MVP)
- Recipe deletion
- Manual shopping list editing
- Recipe search/filtering

---

## Technical Architecture

### MVP Implementation (Current)
**Platform**: Angular 20 single-page application
**Data Storage**: Browser localStorage (ephemeral, no backend)
**State Management**: Angular Services + RxJS
**Deployment**: Azure App Service (static hosting)

### Production Architecture (Reference Design)

**Full-stack architecture for future implementation:**

#### Frontend
- **Framework**: Angular 20 (TypeScript)
- **Hosting**: Azure App Service (Windows)
- **Build**: Angular CLI / esbuild

#### Backend
- **Framework**: ASP.NET Core 8.0 Web API
- **Architecture**: Clean Architecture (API → UseCases → Core → Infrastructure)
- **Pattern**: CQRS with MediatR
- **Hosting**: Azure App Service (F1/Free tier initially)

#### Database
- **Provider**: Azure SQL Database (Standard tier)
- **ORM**: Entity Framework Core 8
- **Schema**: SQL Database Project (.sqlproj, not migrations)

#### Azure Services
- **Key Vault**: Secrets and connection strings
- **Application Insights**: Monitoring and logging
- **No CDN** or deployment slots (Phase 1)

#### DevOps
- **Source Control**: GitHub
- **CI/CD**: GitHub Actions
- **Project Management**: Azure DevOps (Boards)

**See [docs/reference-architecture.md](docs/reference-architecture.md) for complete architecture details, database schema, API design, and deployment strategy.**

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
2. Enters recipe name, ingredients (free-text quantity/unit), and instructions
   - Minimum: 1 ingredient, 1 instruction step
   - No character limits
3. Optionally adds servings, prep time, cook time
4. Saves recipe to localStorage
5. Recipe appears in recipe list (cannot be deleted in MVP)

### Flow 2: Plan a Week of Dinners
1. User views weekly dinner planning (7 vertical day cards, Monday-Sunday)
2. Clicks "Add Dinner" on a day
3. Modal opens with scrollable list of saved recipes
4. Selects a recipe and optionally adjusts servings (recipe scaling)
5. Recipe is assigned to that day
6. Repeat for other days (unplanned days are acceptable)

### Flow 3: Auto-Generated Shopping List
1. Shopping list automatically updates when meal plan changes (no manual generation)
2. System aggregates all ingredients from planned recipes
3. Combines duplicate ingredients with loose matching (summing quantities, handling fractions)
4. Groups ingredients by category (Produce, Dairy, Meat, Pantry, etc.)
5. User checks off items while shopping
6. List resets each week (checked items don't carry forward)

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
1. Recipe list view (scrollable list)
2. Recipe creation/edit form (with servings, ingredients, instructions)
3. Weekly dinner planning (7 vertical day cards, Monday-Sunday)
4. Recipe picker modal (triggered when adding dinner to a day)
5. Shopping list view with checkboxes (grouped by category)

*See [docs/design-brief.md](docs/design-brief.md) for detailed design specifications.*

---

## Project Timeline

**Phase 1**: Concept validation ✅ (Complete)
**Phase 2**: Design & prototype ✅ (Complete)
**Phase 3**: Development ✅ (Complete - MVP functional)
**Phase 4**: Testing & polish (In Progress)
**Phase 5**: Investor demo prep (Pending)

**MVP Status**: Core functionality complete, ready for testing and polish

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Ingredient aggregation logic complex | Medium | Start with simple exact-match, enhance later |
| Mobile UX challenging for meal grid | High | Design mobile-first, test early and often |
| Demo data feels fake | Medium | Create realistic, relatable recipes and plans |
| localStorage limits (~5-10MB) | Low | Monitor size, MVP unlikely to hit limits |

---

## ✅ Requirements Complete

All business requirements finalized. See [docs/business-decisions.md](docs/business-decisions.md) for complete decision log.

**Key Decisions**:
- Auto-detect ingredient categories using keyword matching
- Pre-populate with 3 recipes + planned demo week
- Stepper buttons (plus/minus) for adjusting servings

---

## Repository Structure
```
/
├── README.md                 # This file
├── docs/
│   ├── Summary.txt          # Original client meeting notes
│   ├── concepts.md          # Detailed concept analysis
│   ├── business-decisions.md # Business requirements decisions ✅
│   ├── design-brief.md      # Design requirements ✅
│   ├── reference-architecture.md # Full-stack architecture reference ✅
│   └── backlog.md           # Product backlog with 19 stories ✅
└── meal-planner-app/        # Angular 20 application ✅
    ├── src/app/
    │   ├── components/      # Recipe List, Recipe Form, Meal Plan, Shopping List
    │   ├── services/        # Recipe, MealPlan, ShoppingList services
    │   └── models/          # TypeScript interfaces
    └── dist/                # Build output
```

---

## Contact & Feedback

**Project Owner**: [To be filled]
**Last Updated**: 2026-02-01
**Status**: MVP development complete - all core features functional

---

## Quick Links

- [Detailed Concepts](docs/concepts.md) - Core concept analysis
- [Business Decisions](docs/business-decisions.md) - Answered requirements ✅
- [Design Brief](docs/design-brief.md) - Complete design specifications ✅
- [Reference Architecture](docs/reference-architecture.md) - Full-stack technical design ✅
- [Product Backlog](docs/backlog.md) - 19 stories with risk-driven prioritization ✅
- [GitHub Issues](https://github.com/IndifferentDisdain/MealPlanner/issues) - Issue tracker
- Demo Link (to be deployed)
