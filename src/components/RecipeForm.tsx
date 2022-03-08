import React, {useEffect, useState} from "react";
import Ingredient from "./ingredient";
import Recipe from "./recipe";
import {InlineBlock, StyledButton, StyledRecipeForm} from "./styles";

export default function RecipeForm({
 recipe,
 onSubmit,
 onCancel,
}: {
  recipe: Recipe,
  onSubmit: (event: React.SyntheticEvent, recipe: Recipe) => void,
  onCancel: () => void
}) {
  const [recipeFormData, setRecipeFormData] = useState<Recipe>(recipe);

  useEffect(() => {
    setRecipeFormData(recipe)
  }, [recipe]);

  const addIngredient = () => {
    setRecipeFormData({...recipeFormData, ingredients: [...recipeFormData.ingredients, {name: ''}]})
  }

  const removeIngredient = (index: number) => {
    const newIngredients = [...recipeFormData.ingredients];
    newIngredients.splice(index, 1);
    setRecipeFormData({...recipeFormData, ingredients: newIngredients})
  }

  const updateIngredient = (index: number, updatedIngredientName: string) => {
    const newIngredients = [...recipeFormData.ingredients];
    newIngredients[index]['name'] = updatedIngredientName;
    setRecipeFormData({...recipeFormData, ingredients: newIngredients})
  }

  return (
    <StyledRecipeForm
      onSubmit={(event) => onSubmit(event, recipeFormData)}
    >
      <div>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          id='name'
          value={recipeFormData.name}
          required
          onChange={(e) => setRecipeFormData({...recipeFormData, name: e.target.value})}
        />
      </div>
      <div>
        <label htmlFor='description'>Description</label>
        <textarea
          id='description'
          value={recipeFormData.description}
          required
          onChange={(e) => setRecipeFormData({...recipeFormData, description: e.target.value})}
        />
      </div>
      <div>
        <div>
          <InlineBlock>
            <label>Ingredients</label>
          </InlineBlock>
          <InlineBlock>
            <StyledButton type='button' primary={false} onClick={() => addIngredient()}>Add Ingredient</StyledButton>
          </InlineBlock>
        </div>
        {recipeFormData.ingredients.map((ingredient: Ingredient, index: number) => {
          return <div key={`ingredient.name${index}`}>
            <InlineBlock>
              <input
                type='text'
                id='ingredient.name'
                value={ingredient.name}
                data-testid={`ingredient${index}`}
                required
                onChange={(e) => updateIngredient(index, e.target.value)}
              />
            </InlineBlock>
            <InlineBlock>
              <StyledButton type='button' primary={false} onClick={() => removeIngredient(index)}>Remove</StyledButton>
            </InlineBlock>
          </div>

        })}
      </div>
      <StyledButton type='submit' primary={true}>Save</StyledButton>
      <StyledButton type='button' primary={false} onClick={onCancel}>Cancel</StyledButton>
    </StyledRecipeForm>
  );
}