import {render} from "react-dom";
import {BrowserRouter, Navigate, Route, Routes,} from "react-router-dom";
import App from "./App";
import AddRecipe from "./components/AddRecipe"
import EditRecipe from "./components/EditRecipe"
import {GlobalStyles} from "./components/styles";
import React from "react";

const redirectToRecipesPage = () => {
  return <Navigate to={{pathname: '/recipes'}}/>
}

const rootElement = document.getElementById("root");
render(<BrowserRouter>
  <GlobalStyles/>
  <Routes>
    <Route path="/" element={redirectToRecipesPage()}/>
    <Route path="/recipes" element={<App/>}/>
    <Route path="/add" element={<AddRecipe/>}/>
    <Route path="/edit/:id" element={<EditRecipe/>}/>
  </Routes>
</BrowserRouter>, rootElement);