import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import AddRecipe from './AddRecipe';
import {act} from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import {setupServer} from "msw/node";
import {rest} from "msw";
import Recipe from "./recipe";
import {BrowserRouter, Route, Routes} from "react-router-dom";

describe('AddRecipe', () => {
  const server = setupServer();

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('given that the recipe could be saved successfully', () => {
    it('should submit the correct data and redirect to the recipes page when the user clicks Save', async () => {
      server.use(
        rest.post<Recipe>('/api/recipe/recipes', (req, res, ctx) => {
          const {id, name, description, ingredients} = req.body;

          if (id === null && name === 'Pizza Carbonara' && description === 'Put in the oven 15 min' && ingredients.length === 0) {
            return res.once(ctx.json('OK!'))
          } else {
            throw new Error()
          }
        }),
      );

      render(<BrowserRouter>
        <Routes>
          <Route path="/" element='Root'></Route>
          <Route path="/recipes" element='Redirected to recipes page'></Route>
        </Routes>
        <AddRecipe/>
      </BrowserRouter>);

      await act(async () => {
        await userEvent.type(screen.getByLabelText('Name'), 'Pizza Carbonara', {delay: 0.01});
        await userEvent.type(screen.getByLabelText('Description'), 'Put in the oven 15 min', {delay: 0.01});
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Save"}));
      });

      await waitFor(() => {
        expect(screen.getByText('Redirected to recipes page')).toBeInTheDocument();
      });
    });
  });

  describe('given that the recipe could not be saved successfully', () => {
    it('should display the error message when the user clicks Save', async () => {
      server.use(
        rest.post<Recipe>('/api/recipe/recipes', (req, res, ctx) => {
          return res.once(
            ctx.status(500),
            ctx.json({name: ['ERROR']})
          )
        }));

      render(<BrowserRouter>
        <Routes>
          <Route path="/" element='Root'></Route>
          <Route path="/recipes" element='Redirected to recipes page'></Route>
        </Routes>
        <AddRecipe/>
      </BrowserRouter>);

      await act(async () => {
        await userEvent.type(screen.getByLabelText('Name'), 'Pizza Carbonara', {delay: 0.01});
        await userEvent.type(screen.getByLabelText('Description'), 'Put in the oven 15 min', {delay: 0.01});
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
    render(<BrowserRouter>
      <Routes>
        <Route path="/" element='Root'></Route>
        <Route path="/recipes" element='Redirected to recipes page'></Route>
      </Routes>
      <AddRecipe/>
    </BrowserRouter>);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: "Cancel"}));
    });

    await waitFor(() => {
      expect(screen.getByText('Redirected to recipes page')).toBeInTheDocument();
    });
  });
});
