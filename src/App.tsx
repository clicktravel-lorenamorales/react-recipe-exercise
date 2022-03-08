import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import RecipeList from "./components/RecipeList";
import Recipe from "./components/recipe";
import axios from "axios";
import RecipeSearchForm from "./components/RecipeSearchForm";
import {StyledButton} from "./components/styles";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  const retrieveAndShowAllRecipes = () => {
    axios.get(`/api/recipe/recipes/`)
      .then(result => {
        setRecipes(result.data)
      })
  }

  const searchByName = (name: string) => {
    axios.get(`/api/recipe/recipes?name=${name}`)
      .then(result => {
        setRecipes(result.data)
      })
  }

  const useQuery = () => {
    const {search} = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();
  useEffect(() => {
    const nameQueryString = query.get('name');
    if (nameQueryString) {
      searchByName(nameQueryString);
    } else {
      retrieveAndShowAllRecipes();
    }
  }, [query]);

  const onSearch = (event: React.SyntheticEvent, name: string) => {
    event.preventDefault();
    navigate(`/recipes?name=${name}`);
  }

  const onClear = () => {
    navigate('/recipes');
  }

  const onDelete = (id: number) => {
    axios.delete(`/api/recipe/recipes/${id}`)
      .then(result => {
        setRecipes([...recipes.filter(recipe => recipe.id !== id)])
      })
  }

  const onEdit = (id: number) => {
    navigate(`/edit/${id}`)
  }

  return (
      <div>
        <h1>Recipes</h1>
        <RecipeSearchForm name={query.get('name') || ''} onSearch={onSearch} onClear={onClear}/>
        <StyledButton primary={true} onClick={() => navigate('/add')}>Create new recipe</StyledButton>
        <RecipeList recipes={recipes} onSearch={onSearch} onEdit={onEdit} onDelete={onDelete}></RecipeList>
      </div>
  );
}

export default App;
