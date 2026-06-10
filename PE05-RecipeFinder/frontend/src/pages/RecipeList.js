import React, { useState, useEffect } from "react";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import "./RecipeList.css";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/recipes");
      if (!res.ok) throw new Error("Failed to load recipes");
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleDelete = async (recipeId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this recipe?")) return;
    try {
      const res = await fetch(`/api/recipes/${recipeId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
      if (id === recipeId) navigate("/recipes");
    } catch (err) {
      alert("Could not delete recipe: " + err.message);
    }
  };

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container recipe-list-page">
      <div className="list-header">
        <h1 className="page-title">📋 All Recipes</h1>
        <Link to="/add-recipe" className="btn btn-primary btn-sm">
          + Add Recipe
        </Link>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search recipes by name or category…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="recipe-split">
        {/* ── LEFT: Recipe list ── */}
        <aside className="recipe-sidebar">
          {loading && (
            <div className="spinner-wrap"><div className="spinner" /></div>
          )}
          {error && <div className="alert alert-error">{error}</div>}
          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No recipes found</h3>
              <p>Try a different search or add a new recipe.</p>
            </div>
          )}
          {!loading && filtered.map((recipe) => (
            <Link
              key={recipe._id}
              to={`/recipes/${recipe._id}`}
              className={`recipe-item card ${id === recipe._id ? "active" : ""}`}
            >
              <div className="recipe-item-body">
                <div className="recipe-item-name">{recipe.name}</div>
                <div className="recipe-item-meta">
                  <span className="badge">{recipe.category || "General"}</span>
                  {recipe.cookTime && <span className="meta-info">⏱ {recipe.cookTime}</span>}
                </div>
              </div>
              <button
                className="btn btn-danger btn-sm delete-btn"
                onClick={(e) => handleDelete(recipe._id, e)}
                title="Delete recipe"
              >
                🗑
              </button>
            </Link>
          ))}
        </aside>

        {/* ── RIGHT: Nested recipe detail ── */}
        <section className="recipe-detail-panel">
          {id ? (
            <Outlet context={{ onDelete: (rid) => {
              setRecipes((prev) => prev.filter((r) => r._id !== rid));
            }}} />
          ) : (
            <div className="empty-state select-prompt">
              <div className="empty-icon">👈</div>
              <h3>Select a recipe</h3>
              <p>Click any recipe on the left to see its details.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default RecipeList;
