import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import RecipeForm from './RecipeForm';
import {act} from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

describe('RecipeForm', () => {
  describe('Given a recipe', () => {
    const recipe = {
      id: 1,
      name: 'Pizza',
      description: 'Put in the oven',
      ingredients: [{
        name: 'cheese'
      },
        {
          name: 'mushrooms'
        }]
    }

    it('should load successfully the form with the recipe values', async () => {
      const onSubmitMock = jest.fn();
      const onCancelMock = jest.fn();
      render(<RecipeForm recipe={recipe} onSubmit={onSubmitMock} onCancel={onCancelMock}/>);

      expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument();
      expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Pizza');
      expect((screen.getByLabelText('Description') as HTMLInputElement).value).toBe('Put in the oven');
      expect((screen.getByTestId('ingredient0') as HTMLInputElement).value).toBe('cheese');
      expect((screen.getByTestId('ingredient1') as HTMLInputElement).value).toBe('mushrooms');
    });

    it('should submit the correct data when the user has removed an ingredient and clicks Save', async () => {
      const onSubmitMock = jest.fn(e => e.preventDefault());
      const onCancelMock = jest.fn();
      render(<RecipeForm recipe={recipe} onSubmit={onSubmitMock} onCancel={onCancelMock}/>);

      await act(async () => {
        const firstRemoveButton = screen.getAllByRole('button', {name: "Remove"})[0]
        fireEvent.click(firstRemoveButton);
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Save"}));
      });

      expect(onSubmitMock).toHaveBeenCalledWith(expect.anything(), {...recipe, ingredients: [{name: 'mushrooms'}]})
    });

    it('should submit the correct data when the user has added a new ingredient and clicks Save', async () => {
      const onSubmitMock = jest.fn(e => e.preventDefault());
      const onCancelMock = jest.fn();
      render(<RecipeForm recipe={recipe} onSubmit={onSubmitMock} onCancel={onCancelMock}/>);

      await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Add Ingredient"}));
      });

      await act(async () => {
        await userEvent.type(screen.getByTestId('ingredient2'), 'olives', {delay: 0.01});
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Save"}));
      });

      expect(onSubmitMock).toHaveBeenCalledWith(expect.anything(), {
        ...recipe,
        ingredients: [{name: 'cheese'}, {name: 'mushrooms'}, {name: 'olives'}]
      })
    });

    it('should submit the correct data when the user has modified a field and clicks Save', async () => {
      const onSubmitMock = jest.fn(e => e.preventDefault());
      const onCancelMock = jest.fn();
      render(<RecipeForm recipe={recipe} onSubmit={onSubmitMock} onCancel={onCancelMock}/>);

      await act(async () => {
        await userEvent.type(screen.getByLabelText('Name'), ' Carbonara', {delay: 0.01});
        await userEvent.type(screen.getByLabelText('Description'), ' 15 min', {delay: 0.01});
        const secondIngredientInput = screen.getByTestId('ingredient0') as HTMLInputElement;
        secondIngredientInput.setSelectionRange(0, 6)
        userEvent.type(secondIngredientInput, '{backspace}mozzarella')
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Save"}));
      });

      expect(onSubmitMock).toHaveBeenCalledWith(expect.anything(), {
        ...recipe,
        name: 'Pizza Carbonara',
        description: 'Put in the oven 15 min',
        ingredients: [{name: 'mozzarella'}, {name: 'mushrooms'}]
      })
    });

    it('should call onCancel when the user clicks Cancel', async () => {
      const onSubmitMock = jest.fn();
      const onCancelMock = jest.fn();
      render(<RecipeForm recipe={recipe} onSubmit={onSubmitMock} onCancel={onCancelMock}/>);

      await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Cancel"}));
      });

      expect(onCancelMock).toHaveBeenCalled();
    });
  });
});
