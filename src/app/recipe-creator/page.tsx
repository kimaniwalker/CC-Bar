import type { Ingredients, Recipes } from "@/types/Recipes";
import { RecipeCreatorForm } from "@/components/client/Recipes/RecipeCreatorForm";

type IngredientDraft = Ingredients & {
  percentage: string;
};

function createInitialRecipe(): Recipes {
  return {
    id: "",
    user_id: "",
    product_id: "",
    name: "",
    created_at: "",
  };
}

function createInitialIngredient(): IngredientDraft {
  return {
    id: "",
    name: "",
    ingredient_type: "fragrance",
    stock: 0,
    unit: "oz",
    cost: 0,
    active: true,
    created_at: "",
    percentage: "0",
  };
}

export default function RecipeCreatorPage() {
  return (
    <RecipeCreatorForm
      initialRecipe={createInitialRecipe()}
      initialIngredient={createInitialIngredient()}
    />
  );
}
