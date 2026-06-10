import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext, Link } from "react-router-dom";
import "./RecipeDetail.css";

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useOutletContext();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) throw new Error("Recipe not found");
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${recipe.name}"?`)) return;
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      if (context?.onDelete) context.onDelete(id);
      navigate("/recipes");
    } catch (err) {
      alert("Could not delete: " + err.message);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (error)   return <div className="alert alert-error">{error}</div>;
  if (!recipe) return null;

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

  return (
    <div className="detail-card card">
      {/* Header */}
      <div className="detail-header">
        <div>
          <span className="badge">{recipe.category || "General"}</span>
          <h2 className="detail-title">{recipe.name}</h2>
          {recipe.description && (
            <p className="detail-desc">{recipe.description}</p>
          )}
        </div>
        <div className="detail-actions">
          <Link to={`/edit-recipe/${id}`} className="btn btn-success btn-sm">
            ✏️ Edit
          </Link>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            🗑 Delete
          </button>
        </div>
      </div>

      {/* Meta chips */}
      <div className="detail-meta">
        {recipe.prepTime  && <div className="meta-chip"><span>🕐</span><div><small>Prep</small><strong>{recipe.prepTime}</strong></div></div>}
        {recipe.cookTime  && <div className="meta-chip"><span>🍳</span><div><small>Cook</small><strong>{recipe.cookTime}</strong></div></div>}
        {recipe.servings  && <div className="meta-chip"><span>👥</span><div><small>Serves</small><strong>{recipe.servings}</strong></div></div>}
      </div>

      {/* Ingredients */}
      <section className="detail-section">
        <h3 className="section-heading">🥗 Ingredients</h3>
        {ingredients.length > 0 ? (
          <ul className="ingredient-list">
            {ingredients.map((ing, i) => (
              <li key={i} className="ingredient-item">
                <span className="ingredient-bullet" />
                {ing}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted-text">No ingredients listed.</p>
        )}
      </section>

      {/* Instructions */}
      <section className="detail-section">
        <h3 className="section-heading">📝 Instructions</h3>
        <div className="instructions-text">
          {recipe.instructions.split("\n").map((line, i) =>
            line.trim() ? <p key={i}>{line}</p> : <br key={i} />
          )}
        </div>
      </section>

      {recipe.updatedAt && (
        <p className="detail-footer">
          Last updated: {new Date(recipe.updatedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export default RecipeDetail;
