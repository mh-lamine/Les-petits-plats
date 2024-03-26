function updateTagsList(recipes) {
  let ingredients = document.querySelectorAll(".ingredients .items-list li");
  let appliances = document.querySelectorAll(".appliances .items-list li");
  let ustensils = document.querySelectorAll(".ustensils .items-list li");

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
    } else {
      ingredient.classList.remove("hidden");
    }
  });

  appliances.forEach((appliance) => {
    let itemName = appliance.textContent.toLowerCase();

    let isPartOfRecipes = recipes.some(
      (recipe) => recipe.appliance.toLowerCase() === itemName
    );

    if (!isPartOfRecipes) {
      appliance.classList.add("hidden");
    } else {
      appliance.classList.remove("hidden");
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
    } else {
      ustensil.classList.remove("hidden");
    }
  });
}

export { updateTagsList };
