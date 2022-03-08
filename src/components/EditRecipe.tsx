import axios from "axios";
import React, {useEffect, useState} from "react";
import * as Router from 'react-router-dom';
import RecipeForm from "./RecipeForm";
import Recipe from "./recipe";
import {ErrorMessage} from "./styles";

const {useNavigate, useParams} = Router;

export default function EditRecipe() {
  const [recipe, setRecipe] = useState<Recipe>({id: null, name: '', description: '', ingredients: []});
  const [backendErrors, setBackendError] = useState('');
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    axios
      .get(`/api/recipe/recipes/${params.id}/`)
      .then(result => {
        setRecipe(result.data)
      });
  }, [params]);

  const onSubmit = (event: React.SyntheticEvent, recipe: Recipe) => {
    event.preventDefault();
    setBackendError('');
    axios.patch(`/api/recipe/recipes/${params.id}/`, recipe)
      .then(() => {
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
      <h1>Edit recipe {recipe.name}</h1>
      <ErrorMessage>{backendErrors}</ErrorMessage>
      <RecipeForm
        recipe={recipe}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}