function filterListItems() {
  let ingredientsInput = document.querySelector(
    ".ingredients .list-items input"
  );

  let appliancesInput = document.querySelector(".appliances .list-items input");

  let ustensilsInput = document.querySelector(".ustensils .list-items input");

  ingredientsInput.addEventListener("input", () => {
    let ingredients = document.querySelectorAll(
      ".ingredients .list-items li:not(.hidden)"
    );
    let search = ingredientsInput.value.toLowerCase();

    ingredients.forEach((ingredient) => {
      let itemName = ingredient.textContent.toLowerCase();
      let show = itemName.includes(search);

      if (!show) {
        ingredient.style.display = "none";
      } else {
        ingredient.style.display = "block";
      }
    });
  });

  document
    .querySelector(".ingredients .list-items .clear-button")
    .addEventListener("click", () => {
      ingredientsInput.value = "";
      let ingredients = document.querySelectorAll(
        ".ingredients .list-items li:not(.hidden)"
      );
      ingredients.forEach((ingredient) => {
        ingredient.style.display = "block";
      });
    });

  appliancesInput.addEventListener("input", () => {
    let appliances = document.querySelectorAll(
      ".appliances .list-items li:not(.hidden)"
    );
    let search = appliancesInput.value.toLowerCase();

    appliances.forEach((appliance) => {
      let itemName = appliance.textContent.toLowerCase();

      let show = itemName.includes(search);

      if (!show) {
        appliance.style.display = "none";
      } else {
        appliance.style.display = "block";
      }
    });
  });

  document
    .querySelector(".appliances .list-items .clear-button")
    .addEventListener("click", () => {
      appliancesInput.value = "";
      let appliances = document.querySelectorAll(
        ".appliances .list-items li:not(.hidden)"
      );
      appliances.forEach((appliance) => {
        appliance.style.display = "block";
      });
    });

  ustensilsInput.addEventListener("input", () => {
    let ustensils = document.querySelectorAll(
      ".ustensils .list-items li:not(.hidden)"
    );
    let search = ustensilsInput.value.toLowerCase();

    ustensils.forEach((ustensil) => {
      let itemName = ustensil.textContent.toLowerCase();

      let show = itemName.includes(search);

      if (!show) {
        ustensil.style.display = "none";
      } else {
        ustensil.style.display = "block";
      }
    });
  });

  document
    .querySelector(".ustensils .list-items .clear-button")
    .addEventListener("click", () => {
      ustensilsInput.value = "";
      let ustensils = document.querySelectorAll(
        ".ustensils .list-items li:not(.hidden)"
      );
      ustensils.forEach((ustensil) => {
        ustensil.style.display = "block";
      });
    });
}

export { filterListItems };
