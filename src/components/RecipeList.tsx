import {StyledTable, TBody, TD, THead, TR} from './styles';
import React from "react";
import Recipe from "./recipe";
import RecipeItem from "./RecipeItem";

export default function RecipeList({recipes, onEdit, onDelete}:
                                     {
                                       recipes: Recipe[],
                                       onSearch: (event: React.SyntheticEvent, name: string) => void,
                                       onEdit: (id: number) => void,
                                       onDelete: (id: number) => void,
                                     }) {
  return (
    <div>
      <StyledTable>
        <THead>
          <TR>
            <TD>Name</TD>
            <TD>Description</TD>
            <TD>Ingredients</TD>
            <TD>Actions</TD>
          </TR>
        </THead>
        <TBody>
          {recipes.map(recipe => (
            <RecipeItem key={recipe.id} recipe={recipe} onEdit={onEdit} onDelete={onDelete}/>
          ))}
        </TBody>
      </StyledTable>
    </div>
  );
}