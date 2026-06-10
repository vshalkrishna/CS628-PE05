import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="nav-logo">
          🍴 Recipe Finder
        </NavLink>

        <button
          className="nav-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setMenuOpen(false)}>
              Recipes
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-recipe" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setMenuOpen(false)}>
              + Add Recipe
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
