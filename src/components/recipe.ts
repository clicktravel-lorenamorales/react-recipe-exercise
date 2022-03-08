import Ingredient from "./ingredient";

type Recipe = {
  id: number | null,
  name: string,
  description: string,
  ingredients: Ingredient[]
}

export default Recipe;