import {StyledButton, TD, TR} from './styles';
import Recipe from "./recipe";
import React from "react";

export default function RecipeItem({
                                     recipe,
                                     onEdit,
                                     onDelete
                                   }: {
  recipe: Recipe,
  onEdit: (id: number) => void,
  onDelete: (id: number) => void
}) {
  return (
    <TR>
      <TD>{recipe.name}</TD>
      <TD>{recipe.description}</TD>
      <TD>
        {recipe.ingredients.map(ingredient => (
          <div key={ingredient.name}>{ingredient.name}</div>
        ))}
      </TD>
      <TD>
        <StyledButton primary={false} type="button" onClick={() => onEdit(recipe.id || -1)}>Edit</StyledButton>
        <StyledButton primary={false} type="button" onClick={() => onDelete(recipe.id || -1)}>Delete</StyledButton>
      </TD>
    </TR>
  );
}