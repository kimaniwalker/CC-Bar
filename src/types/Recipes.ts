export type Ingredients = {
  id: string;
  name: string;
  ingredient_type: "fragrance" | "colorant" | "carrier_oil" | "sugar";
  stock: number;
  unit: string;
  cost: number;
  active: boolean;
  created_at: string;
};

//user_id uuid references auth.users(id),
//product_id uuid references products(id),
export type Recipes = {
  id: string;
  user_id: string;
  product_id: string;
  name: string;
  created_at: string;
};

//recipe_id uuid not null references recipes(id)
//ingredient_id uuid not null references ingredients(id)
export type RecipeIngredients = {
  recipe_id: string;
  ingredient_id: string;
  percentage: number;
};
