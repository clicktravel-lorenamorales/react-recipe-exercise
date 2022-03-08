import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import EditRecipe from './EditRecipe';
import {act} from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import {setupServer} from "msw/node";
import {rest} from "msw";
import Recipe from "./recipe";
import {BrowserRouter, Route, Routes} from "react-router-dom";

describe('EditRecipe', () => {
  const recipe = {
    id: 1,
    name: 'Pizza',
    description: 'Put in the oven',
    ingredients: [{
      name: 'cheese',
    }]
  }
  const server = setupServer();

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.restoreAllMocks();
    server.resetHandlers();
  });
  afterAll(() => server.close())

  afterEach(() => {
    jest.restoreAllMocks();
  })
  describe('given that the recipe could be saved successfully', () => {
    it('should submit the correct data and redirect to the recipes page when the user clicks Save', async () => {
      server.use(
        rest.get<Recipe>('/api/recipe/recipes/1', (req, res, ctx) => {
          return res.once(ctx.json(recipe))
        }),
        rest.patch<Recipe>('/api/recipe/recipes/1', (req, res, ctx) => {
          const {id, name, description, ingredients} = req.body;

          if (id === 1 && name === 'Pizza Carbonara' && description === 'Put in the oven 15 min' && ingredients.length === 1) {
            return res.once(ctx.json('OK!'))
          } else {
            throw new Error()
          }
        }),
      );

      window.history.pushState({}, '', '/edit/1')
      render(<BrowserRouter>
        <Routes>
          <Route path="/" element='Root'></Route>
          <Route path="/edit/:id" element={<EditRecipe/>}></Route>
          <Route path="/recipes" element='Redirected to recipes page'></Route>
        </Routes>
      </BrowserRouter>);

      await waitFor(() => {
        expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Pizza');
      });

      await act(async () => {
        await userEvent.type(screen.getByLabelText('Name'), ' Carbonara', {delay: 0.01});
        await userEvent.type(screen.getByLabelText('Description'), ' 15 min', {delay: 0.01});
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Save"}));
      });

      await waitFor(() => {
        expect(screen.getByText('Redirected to recipes page')).toBeInTheDocument();
      });
    });
  });

  describe('given that the recipe could not be updated successfully', () => {
    it('should display the error message when the user clicks Save', async () => {
      server.use(
        rest.get<Recipe>('/api/recipe/recipes/1', (req, res, ctx) => {
          return res.once(ctx.json(recipe))
        }),
        rest.patch<Recipe>('/api/recipe/recipes/1', (req, res, ctx) => {
          return res.once(
            ctx.status(500),
            ctx.json({name: ['ERROR']})
          )
        }));

      window.history.pushState({}, '', '/edit/1')
      render(<BrowserRouter>
        <Routes>
          <Route path="/" element='Root'></Route>
          <Route path="/edit/:id" element={<EditRecipe/>}></Route>
          <Route path="/recipes" element='Redirected to recipes page'></Route>
        </Routes>
      </BrowserRouter>);

       await waitFor(() => {
        expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Pizza');
      });

      await act(async () => {
        await userEvent.type(screen.getByLabelText('Name'), ' Carbonara', {delay: 0.01});
        await userEvent.type(screen.getByLabelText('Description'), ' 15 min', {delay: 0.01});
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Save"}));
      });

      await waitFor(() => {
        expect(screen.getByText('ERROR')).toBeInTheDocument();
      });
    });
  });

  it('should redirect to the recipes page when the user clicks cancel', async () => {
    window.history.pushState({}, '', '/edit/1')
    server.use(
      rest.get<Recipe>('/api/recipe/recipes/1', (req, res, ctx) => {
        return res.once(ctx.json(recipe))
      }));

      render(<BrowserRouter>
        <Routes>
          <Route path="/" element='Root'></Route>
          <Route path="/edit/:id" element={<EditRecipe/>}></Route>
          <Route path="/recipes" element='Redirected to recipes page'></Route>
        </Routes>
      </BrowserRouter>);


     await waitFor(() => {
        expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Pizza');
      });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: "Cancel"}));
    });

    await waitFor(() => {
      expect(screen.getByText('Redirected to recipes page')).toBeInTheDocument();
    });
  });
});
