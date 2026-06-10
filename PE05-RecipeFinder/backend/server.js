require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "recipe_finder";
let db;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB Atlas - Database: ${dbName}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// ── ROUTES ──────────────────────────────────────────────

// GET /api/recipes - Get all recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await db
      .collection("recipes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes", details: error.message });
  }
});

// GET /api/recipes/:id - Get a single recipe by ID
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }
    const recipe = await db
      .collection("recipes")
      .findOne({ _id: new ObjectId(id) });
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe", details: error.message });
  }
});

// POST /api/recipes - Create a new recipe
app.post("/api/recipes", async (req, res) => {
  try {
    const { name, description, ingredients, instructions, cookTime, prepTime, servings, category } = req.body;

    if (!name || !ingredients || !instructions) {
      return res.status(400).json({ error: "Name, ingredients, and instructions are required" });
    }

    const newRecipe = {
      name: name.trim(),
      description: description?.trim() || "",
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split("\n").filter(Boolean),
      instructions: instructions.trim(),
      cookTime: cookTime || "",
      prepTime: prepTime || "",
      servings: servings || "",
      category: category || "General",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("recipes").insertOne(newRecipe);
    const created = await db.collection("recipes").findOne({ _id: result.insertedId });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: "Failed to create recipe", details: error.message });
  }
});

// PUT /api/recipes/:id - Update a recipe
app.put("/api/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }

    const { name, description, ingredients, instructions, cookTime, prepTime, servings, category } = req.body;

    if (!name || !ingredients || !instructions) {
      return res.status(400).json({ error: "Name, ingredients, and instructions are required" });
    }

    const updatedRecipe = {
      name: name.trim(),
      description: description?.trim() || "",
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split("\n").filter(Boolean),
      instructions: instructions.trim(),
      cookTime: cookTime || "",
      prepTime: prepTime || "",
      servings: servings || "",
      category: category || "General",
      updatedAt: new Date(),
    };

    const result = await db
      .collection("recipes")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedRecipe },
        { returnDocument: "after" }
      );

    if (!result) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update recipe", details: error.message });
  }
});

// DELETE /api/recipes/:id - Delete a recipe
app.delete("/api/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }

    const result = await db.collection("recipes").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe", details: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Recipe Finder API is running" });
});

// Start server
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
