import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {act} from "react-dom/test-utils";
import Recipe from "./components/recipe";

describe('App', () => {
  describe('given that the recipes could be retrieved successfully', () => {
    const server = setupServer(
      rest.get<Recipe[]>('/api/recipe/recipes', (req, res, ctx) => {
        const nameQueryString = req.url.searchParams.get('name')
        if (nameQueryString) {
          return res(ctx.json([{
            id: 1,
            name: 'Pizza',
            description: 'Put it in the oven',
            ingredients: [{name: 'cheese'}, {name: 'mushrooms'}]
          }]))
        }
        return res(ctx.json([{
          id: 1,
          name: 'Pizza',
          description: 'Put it in the oven',
          ingredients: [{name: 'cheese'}, {name: 'mushrooms'}]
        }, {
          id: 2,
          name: 'Paella',
          description: 'Rica rica',
          ingredients: [{name: 'rice'}]
        }]))
      }),
    )

    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('should load successfully the page and display the recipes', async () => {
      // @ts-ignore
      await act(async () => render(<App/>, {wrapper: BrowserRouter}));
      expect(screen.getByRole('button', {name: 'Create new recipe'})).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByRole('button', {name: /Search/i})).toBeInTheDocument();
      expect(screen.getByRole('button', {name: /Clear/i})).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByText(/Pizza/i)).toBeInTheDocument();
        expect(screen.getByText(/Put it in the oven/i)).toBeInTheDocument();
        expect(screen.getByText(/cheese/i)).toBeInTheDocument();
        expect(screen.getByText(/mushrooms/i)).toBeInTheDocument();
        expect(screen.getByText(/Paella/i)).toBeInTheDocument();
        expect(screen.getByText(/Rica rica/i)).toBeInTheDocument();
        expect(screen.getByText(/rice/i)).toBeInTheDocument();
        expect(screen.getAllByRole('button', {name: "Edit"}).length).toBe(2)
        expect(screen.getAllByRole('button', {name: "Delete"}).length).toBe(2)
      });
    });

    describe('given the user clicks the create new recipe button', () => {
      it('should redirect to the add recipe page', async () => {
        // @ts-ignore
        await act(async () => {
          render(
            <BrowserRouter>
              <Routes>
                <Route path="/" element='Root'></Route>
                <Route path="/add" element='Redirected to add recipe page'></Route>
                <Route path="/edit/1" element='Edit recipe page'></Route>
              </Routes>
              <App/>
            </BrowserRouter>);
        });
        await act(async () => {
          fireEvent.click(screen.getByRole('button', {name: 'Create new recipe'}));
        });
        expect(screen.getByText('Redirected to add recipe page')).toBeInTheDocument();
      });
    });

    describe('given the user clicks the edit recipe button', () => {
      it('should redirect to the add recipe page', async () => {
        // @ts-ignore
        await act(async () => {
          render(
            <BrowserRouter>
              <Routes>
                <Route path="/" element='Root'></Route>
                <Route path="/edit/1" element='Redirected to edit recipe page'></Route>
                <Route path="/add" element='Add recipe page'></Route>
              </Routes>
              <App/>
            </BrowserRouter>);
        });
        await waitFor(() => {
          expect(screen.getAllByRole('button', {name: "Edit"}).length).toBe(2)
        });
        await act(async () => {
          const firstEditButton = screen.getAllByRole('button', {name: "Edit"})[0]
          fireEvent.click(firstEditButton);
        });
        expect(screen.getByText('Redirected to edit recipe page')).toBeInTheDocument();
      });
    });

    describe('given the user enters a search attribute and clicks the search button', () => {
      it('should filter the results', async () => {
        // @ts-ignore
        await act(async () => {
          render(
            <BrowserRouter>
              <Routes>
                <Route path="/" element='Root'></Route>
                <Route path="/recipes" element='Redirected to recipes filtered by name'></Route>
                <Route path="/add" element='Add recipe page'></Route>
                <Route path="/edit/1" element='Edit recipe page'></Route>
              </Routes>
              <App/>
            </BrowserRouter>);
        });
        await act(async () => {
          await userEvent.type(screen.getByLabelText('Name', {selector: 'input'}), 'Pizz', {delay: 0.01});
        });

        expect((screen.getByLabelText('Name', {selector: 'input'}) as HTMLInputElement).value).toBe('Pizz');

        await act(async () => {
          fireEvent.click(screen.getByRole('button', {name: "Search"}));
        });

        await waitFor(() => {
          expect(screen.getByText(/Pizza/i)).toBeInTheDocument();
          expect(screen.queryByText(/Paella/i)).not.toBeInTheDocument();
        });
      });
    });
  });
});
