import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import "./FormPage.css";

function AddRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add recipe");
      }
      const created = await res.json();
      setSuccess(true);
      setTimeout(() => navigate(`/recipes/${created._id}`), 1200);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-page">
      <div className="form-page-header">
        <h1 className="page-title">➕ Add New Recipe</h1>
        <Link to="/recipes" className="btn btn-outline btn-sm">← Back to Recipes</Link>
      </div>

      {success && (
        <div className="alert alert-success">
          ✅ Recipe added! Redirecting…
        </div>
      )}

      <div className="form-card card">
        <RecipeForm onSubmit={handleSubmit} loading={loading} submitLabel="Add Recipe" />
      </div>
    </div>
  );
}

export default AddRecipe;
