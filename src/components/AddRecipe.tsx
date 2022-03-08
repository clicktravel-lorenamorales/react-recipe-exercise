import axios from "axios";
import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import Recipe from "./recipe";
import RecipeForm from "./RecipeForm";
import {ErrorMessage} from "./styles";

export default function AddRecipe() {
  const [backendErrors, setBackendError] = useState('');
  const navigate = useNavigate();

  const onSubmit = (event: React.SyntheticEvent, recipe: Recipe) => {
    event.preventDefault();
    setBackendError('');
    axios.post('/api/recipe/recipes/', recipe)
      .then(res => {
        navigate('/recipes');
      }).catch(error => {
      if (error.response) {
        setBackendError(error.response.data.name[0])
      }
    })
  }

  const onCancel = () => {
    navigate('/recipes');
  }

  return (
    <div>
      <h1>Add recipe</h1>
      <ErrorMessage>{backendErrors}</ErrorMessage>
      <RecipeForm
        recipe={{id: null, name: '', description: '', ingredients: []}}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}