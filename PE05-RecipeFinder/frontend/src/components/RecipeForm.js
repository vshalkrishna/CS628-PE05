import React, { useState } from "react";
import "./RecipeForm.css";

const CATEGORIES = ["General", "Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Beverage", "Vegan", "Vegetarian"];

function RecipeForm({ initialData = {}, onSubmit, loading, submitLabel = "Save Recipe" }) {
  const [form, setForm] = useState({
    name:         initialData.name         || "",
    description:  initialData.description  || "",
    category:     initialData.category     || "General",
    prepTime:     initialData.prepTime     || "",
    cookTime:     initialData.cookTime     || "",
    servings:     initialData.servings     || "",
    ingredients:  Array.isArray(initialData.ingredients)
                    ? initialData.ingredients.join("\n")
                    : (initialData.ingredients || ""),
    instructions: initialData.instructions || "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim())         return setError("Recipe name is required.");
    if (!form.ingredients.trim())  return setError("At least one ingredient is required.");
    if (!form.instructions.trim()) return setError("Instructions are required.");
    setError("");
    onSubmit({
      ...form,
      ingredients: form.ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-row">
        <div className="form-group flex-2">
          <label htmlFor="name">Recipe Name *</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Classic Spaghetti Bolognese" />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Short Description</label>
        <input id="description" name="description" value={form.description} onChange={handleChange} placeholder="A brief description of the recipe…" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="prepTime">Prep Time</label>
          <input id="prepTime" name="prepTime" value={form.prepTime} onChange={handleChange} placeholder="e.g. 15 min" />
        </div>
        <div className="form-group">
          <label htmlFor="cookTime">Cook Time</label>
          <input id="cookTime" name="cookTime" value={form.cookTime} onChange={handleChange} placeholder="e.g. 30 min" />
        </div>
        <div className="form-group">
          <label htmlFor="servings">Servings</label>
          <input id="servings" name="servings" value={form.servings} onChange={handleChange} placeholder="e.g. 4" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="ingredients">Ingredients * <span className="label-hint">(one per line)</span></label>
        <textarea
          id="ingredients" name="ingredients"
          value={form.ingredients} onChange={handleChange}
          placeholder={"1 cup flour\n2 eggs\n1/2 cup milk"}
          rows={6}
        />
      </div>

      <div className="form-group">
        <label htmlFor="instructions">Instructions *</label>
        <textarea
          id="instructions" name="instructions"
          value={form.instructions} onChange={handleChange}
          placeholder="Describe the steps to make this recipe…"
          rows={8}
        />
      </div>

      <div className="form-footer">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default RecipeForm;
