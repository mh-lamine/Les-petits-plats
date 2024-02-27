function filterListItems(recipes) {
  let ingredients = document.querySelectorAll(".ingredients .list-items li");
  let appliances = document.querySelectorAll(".appliances .list-items li");
  let ustensils = document.querySelectorAll(".ustensils .list-items li");

  ingredients.forEach((ingredient) => {
    let ingredientName = ingredient.textContent.toLowerCase();

    let show = recipes.some((recipe) =>
      recipe.ingredients.some(
        (recipeIngredient) =>
          recipeIngredient.ingredient.toLowerCase() === ingredientName
      )
    );

    if (show) {
      ingredient.classList.remove("hidden");
    } else {
      ingredient.classList.add("hidden");
    }
  });

  appliances.forEach((appliance) => {
    let applianceName = appliance.textContent.toLowerCase();

    let show = recipes.some(
      (recipe) => recipe.appliance.toLowerCase() === applianceName
    );

    if (show) {
      appliance.classList.remove("hidden");
    } else {
      appliance.classList.add("hidden");
    }
  });

  ustensils.forEach((utensil) => {
    let utensilName = utensil.textContent.toLowerCase();

    let show = recipes.some((recipe) =>
      recipe.ustensils.some(
        (recipeUtensil) => recipeUtensil.toLowerCase() === utensilName
      )
    );

    if (show) {
      utensil.classList.remove("hidden");
    } else {
      utensil.classList.add("hidden");
    }
  });
}

export { filterListItems };