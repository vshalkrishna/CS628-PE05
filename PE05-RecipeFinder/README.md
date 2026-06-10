# PE05 – Recipe Finder
 
A full-stack recipe management app built with React, Node.js, Express, and MongoDB Atlas.
 
## Overview
 
Recipe Finder lets users create, browse, edit, and delete recipes through a clean browser interface. Recipes are persisted in MongoDB Atlas and served via a RESTful Express API.
 
---
 
## Features
 
- **Browse recipes** — search and filter by name or category from a live sidebar list
- **View details** — click any recipe to see ingredients, instructions, timing, and servings
- **Add recipes** — fill out a structured form to create and save a new recipe
- **Edit recipes** — update any field; changes are reflected immediately
- **Delete recipes** — remove a recipe from the list and database in real time
---
 
## Tech Stack
 
| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | React + React Router v6       |
| Backend  | Node.js + Express             |
| Database | MongoDB Atlas (Node.js driver)|
 
---
 
## Routes
 
| Path               | Component    | Description                              |
| ------------------ | ------------ | ---------------------------------------- |
| `/`                | Home         | Landing page                             |
| `/recipes`         | RecipeList   | Browse and search all recipes            |
| `/recipes/:id`     | RecipeDetail | View a single recipe (nested outlet)     |
| `/add-recipe`      | AddRecipe    | Create a new recipe                      |
| `/edit-recipe/:id` | EditRecipe   | Modify an existing recipe                |
 
---
 
## API Endpoints
 
| Method   | Endpoint            | Description           |
| -------- | ------------------- | --------------------- |
| `GET`    | `/api/recipes`      | Fetch all recipes     |
| `GET`    | `/api/recipes/:id`  | Fetch a single recipe |
| `POST`   | `/api/recipes`      | Create a new recipe   |
| `PUT`    | `/api/recipes/:id`  | Update a recipe       |
| `DELETE` | `/api/recipes/:id`  | Delete a recipe       |
 
All responses are JSON. Each write operation automatically updates the document's `updatedAt` timestamp.
 
---
 
## UI Behavior
 
- **Loading** — spinner shown while fetching data
- **Success** — banner confirms adds and edits; app redirects to the recipe's detail page
- **Errors** — alert displayed on failed requests
- **Deletion** — recipe is removed from both the database and the sidebar list instantly