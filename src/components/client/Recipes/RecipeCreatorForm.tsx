"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import type { Ingredients, RecipeIngredients, Recipes } from "@/types/Recipes";
import {
  createNewRecipe,
  type CreateNewRecipeInput,
} from "@/utils/Recipes/createNewRecipe";

const ingredientTypes: Ingredients["ingredient_type"][] = [
  "fragrance",
  "colorant",
  "carrier_oil",
  "sugar",
];

type IngredientDraft = Ingredients & {
  percentage: string;
};

type RecipePayload = {
  recipe: Recipes;
  ingredients: Ingredients[];
  recipeIngredients: RecipeIngredients[];
};

type RecipeCreatorFormProps = {
  initialRecipe: Recipes;
  initialIngredient: IngredientDraft;
};

function buildRecipePayload(
  recipe: Recipes,
  ingredients: IngredientDraft[],
): RecipePayload {
  const recipeIngredients: RecipeIngredients[] = ingredients.map(
    ({ id, percentage }) => ({
      recipe_id: recipe.id,
      ingredient_id: id,
      percentage: Number(percentage) || 0,
    }),
  );

  const ingredientRecords: Ingredients[] = ingredients.map(
    ({ percentage: _percentage, ...ingredient }) => ingredient,
  );

  return {
    recipe,
    ingredients: ingredientRecords,
    recipeIngredients,
  };
}

function buildCreateRecipeInput(
  recipe: Recipes,
  ingredients: IngredientDraft[],
): CreateNewRecipeInput {
  return {
    recipe: {
      user_id: recipe.user_id,
      product_id: recipe.product_id,
      name: recipe.name,
      created_at: recipe.created_at,
    },
    ingredients: ingredients.map(
      ({ id: _id, percentage: _percentage, ...ingredient }) => ingredient,
    ),
    recipeIngredients: ingredients.map(({ percentage }) => ({
      percentage: Number(percentage) || 0,
    })),
  };
}

function createDraftId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createIngredientDraft(): IngredientDraft {
  return {
    id: createDraftId("ingredient"),
    name: "",
    ingredient_type: "fragrance",
    stock: 0,
    unit: "oz",
    cost: 0,
    active: true,
    created_at: new Date().toISOString(),
    percentage: "0",
  };
}

function createRecipeDraft(): Recipes {
  return {
    id: createDraftId("recipe"),
    user_id: "",
    product_id: "",
    name: "",
    created_at: new Date().toISOString(),
  };
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function RecipeCreatorForm({
  initialRecipe,
  initialIngredient,
}: RecipeCreatorFormProps) {
  const [recipe, setRecipe] = useState<Recipes>(initialRecipe);
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([
    initialIngredient,
  ]);
  const [submittedPayload, setSubmittedPayload] =
    useState<RecipePayload | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!initialRecipe.id) {
      setRecipe(createRecipeDraft());
    }

    if (!initialIngredient.id) {
      setIngredients([createIngredientDraft()]);
    }
  }, [initialIngredient.id, initialRecipe.id]);

  const updateRecipeField = <K extends keyof Recipes>(
    field: K,
    value: Recipes[K],
  ) => {
    setRecipe((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateIngredientField = <K extends keyof IngredientDraft>(
    index: number,
    field: K,
    value: IngredientDraft[K],
  ) => {
    setIngredients((current) =>
      current.map((ingredient, ingredientIndex) =>
        ingredientIndex === index
          ? {
              ...ingredient,
              [field]: value,
            }
          : ingredient,
      ),
    );
  };

  const addIngredient = () => {
    setIngredients((current) => [...current, createIngredientDraft()]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((current) =>
      current.length === 1
        ? current
        : current.filter((_, ingredientIndex) => ingredientIndex !== index),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildCreateRecipeInput(recipe, ingredients);

    setSubmitError(null);

    startTransition(async () => {
      try {
        const savedPayload = await createNewRecipe(payload);

        setSubmittedPayload(savedPayload);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Failed to create recipe",
        );
      }
    });
  };

  const resetForm = () => {
    setRecipe(createRecipeDraft());
    setIngredients([createIngredientDraft()]);
    setSubmittedPayload(null);
    setSubmitError(null);
  };

  const draftPayload = buildRecipePayload(recipe, ingredients);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_34%),linear-gradient(180deg,#fffaf3_0%,#ffffff_42%,#f8fafc_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-4xl border border-amber-200/70 bg-neutral-950 text-white shadow-2xl shadow-amber-950/10">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                Recipe creator
              </p>
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                Build a recipe, attach ingredients, and generate the typed
                payload.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base">
                This page is wired to the data shapes in Recipes.ts, so you can
                capture the recipe record, ingredient rows, and the junction
                records in one place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                  Recipe ID
                </p>
                <p className="mt-2 break-all text-sm font-medium text-white">
                  {submittedPayload?.recipe.id ||
                    recipe.id ||
                    "Generated on save"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                  Created at
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {formatDateTime(recipe.created_at)}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                  Ingredient rows
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {ingredients.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-4xl border border-neutral-200 bg-white p-6 shadow-sm shadow-neutral-950/5 sm:p-8"
          >
            <section>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                    Recipe details
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
                    Core recipe record
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
                >
                  Reset draft
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-neutral-700">
                    Recipe name
                  </span>
                  <input
                    value={recipe.name}
                    onChange={(event) =>
                      updateRecipeField("name", event.target.value)
                    }
                    placeholder="Lavender Sugar Scrub"
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-neutral-700">
                    User ID
                  </span>
                  <input
                    value={recipe.user_id}
                    onChange={(event) =>
                      updateRecipeField("user_id", event.target.value)
                    }
                    placeholder="auth.users UUID"
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-neutral-700">
                    Product ID
                  </span>
                  <input
                    value={recipe.product_id}
                    onChange={(event) =>
                      updateRecipeField("product_id", event.target.value)
                    }
                    placeholder="products UUID"
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  />
                </label>

                <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600 sm:col-span-2">
                  <p className="font-medium text-neutral-800">System fields</p>
                  <p className="mt-1">
                    IDs and timestamps are generated for the draft and shown in
                    the header preview.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                    Ingredients
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
                    Build each ingredient row
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Add ingredient
                </button>
              </div>

              <div className="space-y-5">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={ingredient.id}
                    className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">
                          Ingredient {index + 1}
                        </p>
                        <p className="text-xs text-neutral-500 break-all">
                          {ingredient.id}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        disabled={ingredients.length === 1}
                        className="rounded-full border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="space-y-2 md:col-span-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Ingredient name
                        </span>
                        <input
                          value={ingredient.name}
                          onChange={(event) =>
                            updateIngredientField(
                              index,
                              "name",
                              event.target.value,
                            )
                          }
                          placeholder="Lavender oil"
                          className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Ingredient type
                        </span>
                        <select
                          value={ingredient.ingredient_type}
                          onChange={(event) =>
                            updateIngredientField(
                              index,
                              "ingredient_type",
                              event.target
                                .value as Ingredients["ingredient_type"],
                            )
                          }
                          className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-950 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                        >
                          {ingredientTypes.map((type) => (
                            <option key={type} value={type}>
                              {type.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Stock
                        </span>
                        <input
                          value={ingredient.stock}
                          onChange={(event) =>
                            updateIngredientField(
                              index,
                              "stock",
                              Number(event.target.value),
                            )
                          }
                          placeholder="12"
                          className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Unit
                        </span>
                        <input
                          value={ingredient.unit}
                          onChange={(event) =>
                            updateIngredientField(
                              index,
                              "unit",
                              event.target.value,
                            )
                          }
                          placeholder="oz"
                          className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Cost
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={ingredient.cost}
                          onChange={(event) =>
                            updateIngredientField(
                              index,
                              "cost",
                              Number(event.target.value),
                            )
                          }
                          placeholder="0.00"
                          className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Recipe percentage
                        </span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={ingredient.percentage}
                          onChange={(event) =>
                            updateIngredientField(
                              index,
                              "percentage",
                              event.target.value,
                            )
                          }
                          placeholder="25"
                          className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                        />
                      </label>

                      <label className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 md:col-span-2">
                        <input
                          type="checkbox"
                          checked={ingredient.active}
                          onChange={(event) =>
                            updateIngredientField(
                              index,
                              "active",
                              event.target.checked,
                            )
                          }
                          className="h-4 w-4 rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
                        />
                        Active ingredient
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-6">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                {isPending ? "Saving recipe..." : "Create recipe payload"}
              </button>
              <p className="text-sm text-neutral-500">
                The submitted output appears in the preview panel.
              </p>
            </div>

            {submitError ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            ) : null}
          </form>

          <aside className="space-y-6 rounded-4xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm shadow-neutral-950/10 sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
                Preview
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Typed payload output
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                This is the exact structure you can send to your database or
                API.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                  Recipe
                </p>
                <p className="mt-2 text-sm text-neutral-100">
                  {recipe.name || "Untitled recipe"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                  Ingredients
                </p>
                <p className="mt-2 text-sm text-neutral-100">
                  {ingredients.length} ingredient row
                  {ingredients.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
              <pre className="max-h-112 overflow-auto whitespace-pre-wrap wrap-break-word text-xs leading-6 text-emerald-200">
                {JSON.stringify(submittedPayload ?? draftPayload, null, 2)}
              </pre>
            </div>

            {submittedPayload ? (
              <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                Recipe payload generated successfully.
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-300">
                Submit the form to pin the preview to the last saved payload.
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
