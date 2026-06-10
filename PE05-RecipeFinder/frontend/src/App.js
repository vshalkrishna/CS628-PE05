import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Home />} />

            {/* Recipe list + nested detail route */}
            <Route path="/recipes" element={<RecipeList />}>
              <Route path=":id" element={<RecipeDetail />} />
            </Route>

            {/* Add new recipe */}
            <Route path="/add-recipe" element={<AddRecipe />} />

            {/* Edit recipe */}
            <Route path="/edit-recipe/:id" element={<EditRecipe />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
