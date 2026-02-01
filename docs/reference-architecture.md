# Reference Architecture - Recipe Meal Planner

*Version: 1.0*
*Date: 2026-02-01*
*Status: Planning*

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database Design](#database-design)
7. [API Design](#api-design)
8. [Azure Infrastructure](#azure-infrastructure)
9. [CI/CD Pipeline](#cicd-pipeline)
10. [Security & Configuration](#security--configuration)
11. [Development Workflow](#development-workflow)
12. [Project Structure](#project-structure)
13. [Deployment Strategy](#deployment-strategy)

---

## Executive Summary

The Recipe Meal Planner is a web-based application built on Azure cloud infrastructure, designed to help users manage recipes, plan weekly meals, and generate shopping lists. The architecture follows Clean Architecture principles with a clear separation between frontend (Angular), backend (.NET 8 Web API), and data layer (Azure SQL Database).

**Key Characteristics:**
- **Single-tenant** application (multi-tenancy deferred to Phase 2)
- **Authentication deferred** to Phase 2 (MVP is open-access)
- **RESTful API** design without versioning initially
- **Clean Architecture** pattern for maintainability and testability
- **Cloud-native** deployment on Azure
- **CI/CD** via GitHub Actions

---

## Technology Stack

### Frontend
- **Framework**: Angular 20
- **Language**: TypeScript
- **Styling**: CSS (mobile-first approach)
- **State Management**: Angular Services + RxJS
- **Build Tool**: Angular CLI / esbuild
- **Package Manager**: npm

### Backend
- **Framework**: ASP.NET Core 8.0 (Web API)
- **Language**: C# 12
- **ORM**: Entity Framework Core 8
- **Architecture**: Clean Architecture
- **Database Access**: Database Project (not migrations)

### Database
- **Provider**: Azure SQL Database
- **Tier**: Standard (S0 for dev, scalable for production)
- **Access**: Entity Framework Core
- **Schema Management**: SQL Database Project (.sqlproj)

### Cloud Infrastructure (Azure)
- **Frontend Hosting**: Azure App Service (Windows)
- **Backend Hosting**: Azure App Service (Windows, F1/Free tier initially)
- **Database**: Azure SQL Database
- **Secrets Management**: Azure Key Vault
- **Monitoring**: Application Insights
- **No CDN** (Phase 1)
- **No deployment slots** (Phase 1)

### DevOps
- **Source Control**: GitHub
- **CI/CD**: GitHub Actions
- **Project Management**: Azure DevOps (Boards/Work Items)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Angular SPA (TypeScript)                    │  │
│  │  - Recipe Management UI                                  │  │
│  │  - Meal Planning UI                                      │  │
│  │  - Shopping List UI                                      │  │
│  └────────────────────┬─────────────────────────────────────┘  │
└─────────────────────────┼─────────────────────────────────────┘
                          │ HTTPS / JSON
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AZURE APP SERVICE (Frontend)                 │
│                     Static Angular Assets                       │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ RESTful API Calls (JSON)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              AZURE APP SERVICE (Backend - .NET 8)               │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │               API Layer (Controllers)                  │    │
│  │  - RecipesController                                   │    │
│  │  - MealPlansController                                 │    │
│  │  - ShoppingListsController                             │    │
│  └──────────────────────┬─────────────────────────────────┘    │
│                         │                                       │
│  ┌──────────────────────▼─────────────────────────────────┐    │
│  │            Use Cases Layer (Business Logic)            │    │
│  │  - CreateRecipeCommand                                 │    │
│  │  - UpdateRecipeCommand                                 │    │
│  │  - GenerateShoppingListQuery                           │    │
│  └──────────────────────┬─────────────────────────────────┘    │
│                         │                                       │
│  ┌──────────────────────▼─────────────────────────────────┐    │
│  │              Core Layer (Domain Models)                │    │
│  │  - Recipe, Ingredient, MealPlan entities              │    │
│  │  - Domain interfaces (IRecipeRepository)               │    │
│  └──────────────────────┬─────────────────────────────────┘    │
│                         │                                       │
│  ┌──────────────────────▼─────────────────────────────────┐    │
│  │        Infrastructure Layer (Data Access)              │    │
│  │  - EF Core DbContext                                   │    │
│  │  - Repository implementations                          │    │
│  └──────────────────────┬─────────────────────────────────┘    │
└────────────────────────────┼─────────────────────────────────────┘
                          │
                          │ ADO.NET / EF Core
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AZURE SQL DATABASE                           │
│  - Recipes table                                                │
│  - Ingredients table                                            │
│  - MealPlans table                                              │
│  - MealPlanRecipes table (join)                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SUPPORTING SERVICES                          │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ Azure Key Vault  │  │ App Insights     │                    │
│  │ - Conn strings   │  │ - Monitoring     │                    │
│  │ - API keys       │  │ - Logging        │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Angular Application Structure

```
meal-planner-app/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts           # HTTP client wrapper
│   │   │   │   ├── recipe-api.service.ts    # Recipe API calls
│   │   │   │   ├── meal-plan-api.service.ts # Meal plan API calls
│   │   │   │   └── shopping-api.service.ts  # Shopping list API calls
│   │   │   ├── interceptors/
│   │   │   │   └── http-error.interceptor.ts
│   │   │   └── models/
│   │   │       ├── recipe.model.ts
│   │   │       ├── meal-plan.model.ts
│   │   │       └── shopping-list.model.ts
│   │   ├── features/
│   │   │   ├── recipes/
│   │   │   │   ├── recipe-list/
│   │   │   │   ├── recipe-form/
│   │   │   │   └── recipes.routes.ts
│   │   │   ├── meal-plan/
│   │   │   │   ├── meal-plan/
│   │   │   │   ├── recipe-picker/
│   │   │   │   └── meal-plan.routes.ts
│   │   │   └── shopping/
│   │   │       ├── shopping-list/
│   │   │       └── shopping.routes.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   └── bottom-nav/
│   │   │   └── pipes/
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.component.ts
│   ├── environments/
│   │   ├── environment.ts         # API URLs, feature flags
│   │   └── environment.prod.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

### Key Frontend Responsibilities

1. **UI Rendering** - Mobile-first responsive design
2. **User Input Validation** - Client-side validation before API calls
3. **State Management** - Component-level state + service-based shared state
4. **API Communication** - RESTful calls to backend via HttpClient
5. **Error Handling** - User-friendly error messages
6. **Offline Support** - Deferred to Phase 2

---

## Backend Architecture

### Clean Architecture Layers

#### 1. **API Layer** (`MealPlanner.API`)
- ASP.NET Core Web API project
- Controllers for each resource
- Dependency injection configuration
- Middleware (error handling, logging)
- No business logic (thin controllers)

**Controllers:**
```csharp
[ApiController]
[Route("api/[controller]")]
public class RecipesController : ControllerBase
{
    private readonly IMediator _mediator;

    [HttpGet]
    public async Task<IActionResult> GetRecipes()

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRecipe(Guid id)

    [HttpPost]
    public async Task<IActionResult> CreateRecipe(CreateRecipeCommand command)

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRecipe(Guid id, UpdateRecipeCommand command)
}
```

#### 2. **Use Cases Layer** (`MealPlanner.UseCases`)
- CQRS pattern (Commands and Queries)
- MediatR for command/query handling
- Business logic and validation
- No infrastructure dependencies

**Example Use Cases:**
- `CreateRecipeCommand` / `CreateRecipeCommandHandler`
- `UpdateRecipeCommand` / `UpdateRecipeCommandHandler`
- `GetRecipesQuery` / `GetRecipesQueryHandler`
- `GenerateShoppingListQuery` / `GenerateShoppingListQueryHandler`

#### 3. **Core/Domain Layer** (`MealPlanner.Core`)
- Domain entities (Recipe, Ingredient, MealPlan)
- Value objects
- Domain interfaces (IRecipeRepository, IMealPlanRepository)
- Domain exceptions
- No external dependencies

**Entities:**
```csharp
public class Recipe
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Servings { get; set; }
    public int? PrepTime { get; set; }
    public int? CookTime { get; set; }
    public ICollection<Ingredient> Ingredients { get; set; }
    public ICollection<Instruction> Instructions { get; set; }
}

public class Ingredient
{
    public Guid Id { get; set; }
    public Guid RecipeId { get; set; }
    public string Quantity { get; set; }
    public string Unit { get; set; }
    public string Name { get; set; }
    public Recipe Recipe { get; set; }
}
```

#### 4. **Infrastructure Layer** (`MealPlanner.Infrastructure`)
- EF Core DbContext
- Repository implementations
- Azure Key Vault integration
- Application Insights integration
- External service integrations (if any)

**DbContext:**
```csharp
public class MealPlannerDbContext : DbContext
{
    public DbSet<Recipe> Recipes { get; set; }
    public DbSet<Ingredient> Ingredients { get; set; }
    public DbSet<MealPlan> MealPlans { get; set; }
    public DbSet<MealPlanRecipe> MealPlanRecipes { get; set; }
}
```

---

## Database Design

### Database Project Structure

```
MealPlanner.Database/
├── Tables/
│   ├── Recipes.sql
│   ├── Ingredients.sql
│   ├── Instructions.sql
│   ├── MealPlans.sql
│   └── MealPlanRecipes.sql
├── Views/
│   └── (none for Phase 1)
├── StoredProcedures/
│   └── (none for Phase 1)
├── Scripts/
│   ├── SeedData.sql
│   └── Indexes.sql
└── MealPlanner.Database.sqlproj
```

### Schema Design

#### Recipes Table
```sql
CREATE TABLE [dbo].[Recipes]
(
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(200) NOT NULL,
    [Servings] INT NOT NULL DEFAULT 1,
    [PrepTime] INT NULL,        -- minutes
    [CookTime] INT NULL,        -- minutes
    [CreatedDate] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [ModifiedDate] DATETIME2 NULL,

    INDEX IX_Recipes_Name NONCLUSTERED ([Name])
);
```

#### Ingredients Table
```sql
CREATE TABLE [dbo].[Ingredients]
(
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [RecipeId] UNIQUEIDENTIFIER NOT NULL,
    [Quantity] NVARCHAR(50) NOT NULL,  -- free-text, supports fractions
    [Unit] NVARCHAR(50) NOT NULL,      -- free-text
    [Name] NVARCHAR(200) NOT NULL,
    [SortOrder] INT NOT NULL DEFAULT 0,

    CONSTRAINT FK_Ingredients_Recipes FOREIGN KEY ([RecipeId])
        REFERENCES [dbo].[Recipes]([Id]) ON DELETE CASCADE,

    INDEX IX_Ingredients_RecipeId NONCLUSTERED ([RecipeId])
);
```

#### Instructions Table
```sql
CREATE TABLE [dbo].[Instructions]
(
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [RecipeId] UNIQUEIDENTIFIER NOT NULL,
    [StepNumber] INT NOT NULL,
    [Description] NVARCHAR(MAX) NOT NULL,

    CONSTRAINT FK_Instructions_Recipes FOREIGN KEY ([RecipeId])
        REFERENCES [dbo].[Recipes]([Id]) ON DELETE CASCADE,

    INDEX IX_Instructions_RecipeId NONCLUSTERED ([RecipeId])
);
```

#### MealPlans Table
```sql
CREATE TABLE [dbo].[MealPlans]
(
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [WeekStartDate] DATE NOT NULL,          -- Monday of the week
    [CreatedDate] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [ModifiedDate] DATETIME2 NULL,

    INDEX IX_MealPlans_WeekStartDate NONCLUSTERED ([WeekStartDate])
);
```

#### MealPlanRecipes Table (Join)
```sql
CREATE TABLE [dbo].[MealPlanRecipes]
(
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [MealPlanId] UNIQUEIDENTIFIER NOT NULL,
    [RecipeId] UNIQUEIDENTIFIER NOT NULL,
    [DayOfWeek] INT NOT NULL,              -- 0 = Monday, 6 = Sunday
    [MealType] NVARCHAR(50) NOT NULL,      -- 'Dinner' for Phase 1
    [Servings] INT NOT NULL,               -- Scaled servings

    CONSTRAINT FK_MealPlanRecipes_MealPlans FOREIGN KEY ([MealPlanId])
        REFERENCES [dbo].[MealPlans]([Id]) ON DELETE CASCADE,

    CONSTRAINT FK_MealPlanRecipes_Recipes FOREIGN KEY ([RecipeId])
        REFERENCES [dbo].[Recipes]([Id]) ON DELETE NO ACTION,

    INDEX IX_MealPlanRecipes_MealPlanId NONCLUSTERED ([MealPlanId]),
    INDEX IX_MealPlanRecipes_RecipeId NONCLUSTERED ([RecipeId])
);
```

### Seed Data

3 seed recipes will be inserted via `SeedData.sql` script:
1. Creamy Chicken Pasta
2. Quick Veggie Stir Fry
3. Hearty Lentil Soup

---

## API Design

### Base URL Structure

```
Development:  https://localhost:5001/api
Production:   https://mealplanner-api.azurewebsites.net/api
```

### Endpoints

#### Recipes

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/recipes` | Get all recipes | - | `Recipe[]` |
| GET | `/api/recipes/{id}` | Get recipe by ID | - | `Recipe` |
| POST | `/api/recipes` | Create new recipe | `CreateRecipeDto` | `Recipe` |
| PUT | `/api/recipes/{id}` | Update recipe | `UpdateRecipeDto` | `Recipe` |

**Note:** DELETE not supported in Phase 1 per business requirements

#### Meal Plans

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/mealplans/current` | Get current week's plan | - | `MealPlan` |
| GET | `/api/mealplans/{id}` | Get meal plan by ID | - | `MealPlan` |
| POST | `/api/mealplans` | Create meal plan | `CreateMealPlanDto` | `MealPlan` |
| PUT | `/api/mealplans/{id}/dinners/{day}` | Assign recipe to day | `AssignDinnerDto` | `MealPlan` |
| DELETE | `/api/mealplans/{id}/dinners/{day}` | Remove recipe from day | - | `204 No Content` |

#### Shopping Lists

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/shoppinglists/current` | Generate from current meal plan | - | `ShoppingList` |
| PUT | `/api/shoppinglists/items/{id}/check` | Mark item as checked | - | `204 No Content` |

### Data Transfer Objects (DTOs)

#### CreateRecipeDto
```json
{
  "name": "Chicken Pasta",
  "servings": 4,
  "prepTime": 10,
  "cookTime": 20,
  "ingredients": [
    {
      "quantity": "2",
      "unit": "cups",
      "name": "pasta"
    }
  ],
  "instructions": [
    "Boil pasta according to package directions."
  ]
}
```

#### AssignDinnerDto
```json
{
  "recipeId": "guid-here",
  "servings": 4
}
```

#### ShoppingList Response
```json
{
  "weekStartDate": "2026-02-03",
  "categories": [
    {
      "name": "Produce",
      "items": [
        {
          "name": "onion",
          "quantity": "3",
          "unit": "whole",
          "isChecked": false
        }
      ]
    }
  ]
}
```

### Error Responses

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Name": ["Recipe name is required."],
    "Ingredients": ["At least one ingredient is required."]
  }
}
```

---

## Azure Infrastructure

### Resource Group Structure

```
rg-mealplanner-dev
├── app-mealplanner-frontend-dev    (App Service - Frontend)
├── app-mealplanner-api-dev         (App Service - Backend)
├── sql-mealplanner-dev             (Azure SQL Server)
│   └── db-mealplanner-dev          (SQL Database)
├── kv-mealplanner-dev              (Key Vault)
└── appi-mealplanner-dev            (Application Insights)

rg-mealplanner-prod
├── app-mealplanner-frontend-prod
├── app-mealplanner-api-prod
├── sql-mealplanner-prod
│   └── db-mealplanner-prod
├── kv-mealplanner-prod
└── appi-mealplanner-prod
```

### App Service Configuration

**Frontend App Service:**
- OS: Windows
- Runtime: Node 20 LTS
- Tier: F1 (Free) for dev
- Always On: Disabled (Free tier)
- HTTPS Only: Enabled
- Deployment: GitHub Actions

**Backend App Service:**
- OS: Windows
- Runtime: .NET 8
- Tier: F1 (Free) for dev
- Always On: Disabled (Free tier)
- HTTPS Only: Enabled
- CORS: Frontend URL configured
- Deployment: GitHub Actions

### Azure SQL Database

**Server:**
- Version: SQL Server 2022
- Location: East US (or preferred region)
- Authentication: SQL Authentication + Azure AD (Phase 2)

**Database:**
- Tier: Standard S0 (10 DTUs) for dev
- Max Size: 250 GB
- Backup: Automated daily backups (7-day retention)

### Azure Key Vault

**Secrets Stored:**
- `ConnectionStrings--MealPlannerDb` - SQL connection string
- `ApplicationInsights--ConnectionString`
- Future: API keys, certificates

**Access Policies:**
- Backend App Service: Get, List secrets (via Managed Identity)
- Developers: Get, List, Set, Delete (for local dev)

### Application Insights

**Monitoring:**
- Request/response tracking
- Exception logging
- Custom events for key user actions
- Performance metrics (response times, dependencies)

**Alerts:**
- API response time > 2 seconds
- Error rate > 5%
- Failed requests spike

---

## CI/CD Pipeline

### GitHub Actions Workflows

#### 1. **Frontend Build & Deploy** (`.github/workflows/frontend-deploy.yml`)

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'meal-planner-app/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci
        working-directory: ./meal-planner-app

      - name: Build Angular app
        run: npm run build -- --configuration production
        working-directory: ./meal-planner-app

      - name: Deploy to Azure App Service
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'app-mealplanner-frontend-prod'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND }}
          package: ./meal-planner-app/dist
```

#### 2. **Backend Build & Deploy** (`.github/workflows/backend-deploy.yml`)

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'src/MealPlanner.API/**'
      - 'src/MealPlanner.Core/**'
      - 'src/MealPlanner.UseCases/**'
      - 'src/MealPlanner.Infrastructure/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'

      - name: Restore dependencies
        run: dotnet restore

      - name: Build
        run: dotnet build --configuration Release --no-restore

      - name: Test
        run: dotnet test --no-build --verbosity normal

      - name: Publish
        run: dotnet publish src/MealPlanner.API/MealPlanner.API.csproj -c Release -o ./publish

      - name: Deploy to Azure App Service
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'app-mealplanner-api-prod'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND }}
          package: ./publish
```

#### 3. **Database Deploy** (`.github/workflows/database-deploy.yml`)

```yaml
name: Deploy Database

on:
  push:
    branches: [main]
    paths:
      - 'src/MealPlanner.Database/**'

jobs:
  deploy:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Database Project
        run: msbuild src/MealPlanner.Database/MealPlanner.Database.sqlproj /p:Configuration=Release

      - name: Deploy to Azure SQL
        uses: azure/sql-action@v2
        with:
          server-name: sql-mealplanner-prod.database.windows.net
          connection-string: ${{ secrets.AZURE_SQL_CONNECTION_STRING }}
          dacpac-package: ./src/MealPlanner.Database/bin/Release/MealPlanner.Database.dacpac
```

### GitHub Secrets Required

- `AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND`
- `AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND`
- `AZURE_SQL_CONNECTION_STRING`

---

## Security & Configuration

### Environment Configuration

**Frontend (`environment.ts`):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api',
  appInsightsConnectionString: '<local-instrumentation-key>'
};
```

**Backend (`appsettings.json`):**
```json
{
  "ConnectionStrings": {
    "MealPlannerDb": "Server=localhost;Database=MealPlanner;..."
  },
  "ApplicationInsights": {
    "ConnectionString": "InstrumentationKey=..."
  },
  "Cors": {
    "AllowedOrigins": ["https://localhost:4200"]
  }
}
```

**Production config via Azure Key Vault:**
- Connection strings pulled from Key Vault at runtime
- App Service uses Managed Identity to access Key Vault
- No secrets in `appsettings.Production.json`

### CORS Configuration

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration["Cors:AllowedOrigins"])
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

---

## Development Workflow

### Local Development Setup

#### Prerequisites
- Node.js 20+
- .NET 8 SDK
- SQL Server 2022 (LocalDB or Express)
- Visual Studio 2022 or VS Code
- Azure CLI (for Key Vault access)

#### Setup Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/IndifferentDisdain/MealPlanner.git
   cd MealPlanner
   ```

2. **Database Setup**
   ```bash
   # Deploy database project to LocalDB
   msbuild src/MealPlanner.Database/MealPlanner.Database.sqlproj
   # Publish to (localdb)\MSSQLLocalDB
   ```

3. **Backend Setup**
   ```bash
   cd src/MealPlanner.API
   dotnet restore
   dotnet run  # Runs on https://localhost:5001
   ```

4. **Frontend Setup**
   ```bash
   cd meal-planner-app
   npm install
   ng serve  # Runs on http://localhost:4200
   ```

### Development Workflow

1. Create feature branch from `main`
2. Develop locally (backend on port 5001, frontend on port 4200)
3. Run tests: `dotnet test` (backend), `ng test` (frontend)
4. Commit with proper message (see CLAUDE.md)
5. Push branch and create PR
6. PR triggers CI checks (build, test)
7. After approval, squash merge to `main`
8. `main` push triggers deployment to Azure

---

## Project Structure

### Solution Structure

```
MealPlanner/
├── .github/
│   └── workflows/
│       ├── frontend-deploy.yml
│       ├── backend-deploy.yml
│       └── database-deploy.yml
├── docs/
│   ├── concepts.md
│   ├── business-decisions.md
│   ├── design-brief.md
│   └── reference-architecture.md (this file)
├── meal-planner-app/           # Angular frontend
│   ├── src/
│   ├── angular.json
│   └── package.json
├── src/
│   ├── MealPlanner.API/        # ASP.NET Core Web API
│   │   ├── Controllers/
│   │   ├── Program.cs
│   │   └── MealPlanner.API.csproj
│   ├── MealPlanner.UseCases/   # CQRS Commands/Queries
│   │   ├── Recipes/
│   │   ├── MealPlans/
│   │   └── MealPlanner.UseCases.csproj
│   ├── MealPlanner.Core/       # Domain Models
│   │   ├── Entities/
│   │   ├── Interfaces/
│   │   └── MealPlanner.Core.csproj
│   ├── MealPlanner.Infrastructure/  # EF Core, Repositories
│   │   ├── Data/
│   │   ├── Repositories/
│   │   └── MealPlanner.Infrastructure.csproj
│   └── MealPlanner.Database/   # SQL Database Project
│       ├── Tables/
│       ├── Scripts/
│       └── MealPlanner.Database.sqlproj
├── tests/
│   ├── MealPlanner.API.Tests/
│   ├── MealPlanner.UseCases.Tests/
│   └── MealPlanner.Core.Tests/
├── MealPlanner.sln
└── README.md
```

---

## Deployment Strategy

### Phase 1: Manual Deployment (Current)

1. **Database**: Deploy .sqlproj via Visual Studio to Azure SQL
2. **Backend**: Publish from Visual Studio to Azure App Service
3. **Frontend**: `ng build --prod` → Manual upload to App Service

### Phase 2: Automated CI/CD (Target)

1. Push to `main` branch
2. GitHub Actions triggers parallel workflows:
   - Database workflow (if db files changed)
   - Backend workflow (if src/ files changed)
   - Frontend workflow (if meal-planner-app/ files changed)
3. Each workflow builds, tests, and deploys to Azure
4. Application Insights monitors deployment success

### Rollback Strategy

- **Frontend**: Redeploy previous build from GitHub Actions artifacts
- **Backend**: Use Azure App Service deployment slots (Phase 2)
- **Database**: Restore from automated backup (7-day retention)

---

## Future Enhancements (Phase 2+)

### Authentication & Authorization
- Azure AD B2C for user authentication
- Multi-tenant support
- User-specific meal plans and recipes

### Performance Optimization
- Azure CDN for static assets
- Azure Redis Cache for frequently accessed data
- Deployment slots for zero-downtime deployments

### Advanced Features
- Recipe sharing between users
- Nutritional information integration
- Grocery delivery API integration
- Mobile apps (iOS/Android via Capacitor)

### Scalability
- Upgrade App Service tier (S1 or higher)
- Azure SQL Database scaling (P1 or higher)
- Azure Front Door for global distribution

---

## Summary

This reference architecture provides a production-ready foundation for the Recipe Meal Planner application, following industry best practices:

- **Clean Architecture** for maintainability and testability
- **Cloud-native** with Azure PaaS services
- **CI/CD ready** with GitHub Actions
- **Scalable** infrastructure that can grow with the application
- **Secure** configuration with Azure Key Vault
- **Observable** with Application Insights monitoring

**Note**: The current MVP implementation uses Angular with localStorage only. This architecture document serves as the blueprint for the full production system when backend services are needed.

---

**Last Updated**: 2026-02-01
**Version**: 1.0
**Status**: Planning/Design Phase
