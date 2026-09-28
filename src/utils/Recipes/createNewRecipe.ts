"use server";

import type { Ingredients, RecipeIngredients, Recipes } from "@/types/Recipes";
import { createClient } from "@/utils/supabase/server";

export type CreateNewRecipeInput = {
  recipe: Omit<Recipes, "id">;
  ingredients: Omit<Ingredients, "id">[];
  recipeIngredients: Pick<RecipeIngredients, "percentage">[];
};

export type CreateNewRecipeResult = {
  recipe: Recipes;
  ingredients: Ingredients[];
  recipeIngredients: RecipeIngredients[];
};

export async function createNewRecipe({
  recipe,
  ingredients,
  recipeIngredients,
}: CreateNewRecipeInput): Promise<CreateNewRecipeResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_recipe_with_ingredients", {
    p_recipe: recipe,
    p_ingredients: ingredients,
    p_recipe_ingredients: recipeIngredients,
  });

  if (error) {
    console.error("Failed to create recipe payload via RPC:", error);
    throw new Error(error.message || "Failed to create recipe");
  }

  return data as CreateNewRecipeResult;
}
