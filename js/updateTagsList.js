function updateTagsList(recipes) {
  let ingredients = document.querySelectorAll(".ingredients .list-items li");
  let appliances = document.querySelectorAll(".appliances .list-items li");
  let ustensils = document.querySelectorAll(".ustensils .list-items li");

  ingredients.forEach((ingredient) => {
    let itemName = ingredient.textContent.toLowerCase();

    let isPartOfRecipes = recipes.some((recipe) =>
      recipe.ingredients.some(
        (recipeIngredient) =>
          recipeIngredient.ingredient.toLowerCase() === itemName
      )
    );

    if (!isPartOfRecipes) {
      ingredient.classList.add("hidden");
    }
  });

  appliances.forEach((appliance) => {
    let itemName = appliance.textContent.toLowerCase();

    let isPartOfRecipes = recipes.some(
      (recipe) => recipe.appliance.toLowerCase() === itemName
    );

    if (!isPartOfRecipes) {
      appliance.classList.add("hidden");
    }
  });

  ustensils.forEach((ustensil) => {
    let ustensilName = ustensil.textContent.toLowerCase();
    let isPartOfRecipes = recipes.some((recipe) =>
      recipe.ustensils.some(
        (recipeUstensil) => recipeUstensil.toLowerCase() === ustensilName
      )
    );
    if (!isPartOfRecipes) {
      ustensil.classList.add("hidden");
    }
  });
}

export { updateTagsList };
