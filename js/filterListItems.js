function filterListItems(recipes) {
  let ingredients = document.querySelectorAll(".ingredients .list-items li");
  let ingredientsInput = document.querySelector(
    ".ingredients .list-items input"
  );

  let appliances = document.querySelectorAll(".appliances .list-items li");
  let appliancesInput = document.querySelector(".appliances .list-items input");

  let ustensils = document.querySelectorAll(".ustensils .list-items li");
  let ustensilsInput = document.querySelector(".ustensils .list-items input");

  ingredientsInput.addEventListener("input", () => {
    let search = ingredientsInput.value.toLowerCase();

    ingredients.forEach((ingredient) => {
      let itemName = ingredient.textContent.toLowerCase();
      let show =
        itemName.includes(search) ||
        recipes.some((recipe) =>
          recipe.ingredients.some(
            (recipeIngredient) =>
              recipeIngredient.ingredient.toLowerCase() === itemName
          )
        );

      if (show) {
        ingredient.classList.remove("hidden");
      } else {
        ingredient.classList.add("hidden");
      }
    });
  });

  appliancesInput.addEventListener("input", () => {
    let search = appliancesInput.value.toLowerCase();

    appliances.forEach((appliance) => {
      let itemName = appliance.textContent.toLowerCase();

      let show =
        itemName.includes(search) ||
        recipes.some((recipe) => recipe.appliance.toLowerCase() === itemName);

      if (show) {
        appliance.classList.remove("hidden");
      } else {
        appliance.classList.add("hidden");
      }
    });
  });

  ustensilsInput.addEventListener("input", () => {
    let search = ustensilsInput.value.toLowerCase();

    ustensils.forEach((utensil) => {
      let utensilName = utensil.textContent.toLowerCase();

      let show =
        itemName.includes(search) ||
        recipes.some((recipe) =>
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
  });
}

export { filterListItems };
