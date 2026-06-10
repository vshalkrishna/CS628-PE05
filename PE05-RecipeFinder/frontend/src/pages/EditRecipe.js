import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import "./FormPage.css";

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) throw new Error("Recipe not found");
        setRecipe(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update recipe");
      }
      setSuccess(true);
      setTimeout(() => navigate(`/recipes/${id}`), 1200);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (error)   return <div className="container"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="container form-page">
      <div className="form-page-header">
        <h1 className="page-title">✏️ Edit Recipe</h1>
        <Link to={`/recipes/${id}`} className="btn btn-outline btn-sm">← Back to Recipe</Link>
      </div>

      {success && (
        <div className="alert alert-success">
          ✅ Recipe updated! Redirecting…
        </div>
      )}

      <div className="form-card card">
        <RecipeForm
          initialData={recipe}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Update Recipe"
        />
      </div>
    </div>
  );
}

export default EditRecipe;
