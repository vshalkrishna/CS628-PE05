import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">🍴 Recipe Finder</h1>
          <p className="hero-subtitle">
            Discover, create, and manage your favourite recipes in one place.
          </p>
          <div className="hero-actions">
            <Link to="/recipes" className="btn btn-primary hero-btn">
              Browse Recipes
            </Link>
            <Link to="/add-recipe" className="btn btn-outline hero-btn">
              + Add Recipe
            </Link>
          </div>
        </div>
      </div>

      <div className="container features">
        <div className="feature-card card">
          <div className="feature-icon">📋</div>
          <h3>Recipe List</h3>
          <p>Browse all your saved recipes with a clean, organized list view.</p>
        </div>
        <div className="feature-card card">
          <div className="feature-icon">➕</div>
          <h3>Add Recipes</h3>
          <p>Add new recipes with ingredients, instructions, cook times, and more.</p>
        </div>
        <div className="feature-card card">
          <div className="feature-icon">✏️</div>
          <h3>Update & Delete</h3>
          <p>Keep your cookbook fresh by editing or removing any recipe.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
