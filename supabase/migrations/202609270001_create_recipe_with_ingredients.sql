create or replace function public.create_recipe_with_ingredients(
  p_recipe jsonb,
  p_ingredients jsonb,
  p_recipe_ingredients jsonb
)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_recipe public.recipes%rowtype;
  v_ingredient public.ingredients%rowtype;
  v_recipe_ingredient public.recipe_ingredients%rowtype;
  v_ingredient_source record;
  v_recipe_ingredient_source record;
  v_ingredient_ids uuid[] := '{}';
  v_ingredients_result jsonb := '[]'::jsonb;
  v_recipe_ingredients_result jsonb := '[]'::jsonb;
begin
  if p_recipe is null then
    raise exception 'Recipe payload is required';
  end if;

  if p_ingredients is null or jsonb_typeof(p_ingredients) <> 'array' then
    raise exception 'Ingredients payload must be a JSON array';
  end if;

  if p_recipe_ingredients is null or jsonb_typeof(p_recipe_ingredients) <> 'array' then
    raise exception 'Recipe ingredients payload must be a JSON array';
  end if;

  if jsonb_array_length(p_ingredients) = 0 then
    raise exception 'At least one ingredient is required';
  end if;

  if jsonb_array_length(p_ingredients) <> jsonb_array_length(p_recipe_ingredients) then
    raise exception 'recipe_ingredients must contain one row for each ingredient';
  end if;

  insert into public.recipes (
    user_id,
    product_id,
    name,
    created_at
  )
  values (
    (p_recipe->>'user_id')::uuid,
    (p_recipe->>'product_id')::uuid,
    p_recipe->>'name',
    coalesce((p_recipe->>'created_at')::timestamptz, now())
  )
  returning * into v_recipe;

  for v_ingredient_source in
    select value as item, ordinality
    from jsonb_array_elements(p_ingredients) with ordinality
  loop
    insert into public.ingredients (
      name,
      ingredient_type,
      stock,
      unit,
      cost,
      active,
      created_at
    )
    values (
      v_ingredient_source.item->>'name',
      v_ingredient_source.item->>'ingredient_type',
      coalesce((v_ingredient_source.item->>'stock')::numeric, 0),
      v_ingredient_source.item->>'unit',
      coalesce((v_ingredient_source.item->>'cost')::numeric, 0),
      coalesce((v_ingredient_source.item->>'active')::boolean, true),
      coalesce((v_ingredient_source.item->>'created_at')::timestamptz, now())
    )
    returning * into v_ingredient;

    v_ingredient_ids := array_append(v_ingredient_ids, v_ingredient.id);
    v_ingredients_result := v_ingredients_result || jsonb_build_array(to_jsonb(v_ingredient));
  end loop;

  for v_recipe_ingredient_source in
    select value as item, ordinality
    from jsonb_array_elements(p_recipe_ingredients) with ordinality
  loop
    insert into public.recipe_ingredients (
      recipe_id,
      ingredient_id,
      percentage
    )
    values (
      v_recipe.id,
      v_ingredient_ids[v_recipe_ingredient_source.ordinality],
      coalesce((v_recipe_ingredient_source.item->>'percentage')::numeric, 0)
    )
    returning * into v_recipe_ingredient;

    v_recipe_ingredients_result := v_recipe_ingredients_result || jsonb_build_array(to_jsonb(v_recipe_ingredient));
  end loop;

  return jsonb_build_object(
    'recipe', to_jsonb(v_recipe),
    'ingredients', v_ingredients_result,
    'recipeIngredients', v_recipe_ingredients_result
  );
end;
$$;