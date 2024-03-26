function createItemsList(recipes) {
  const ingredients = [];
  const utensils = [];
  const appliances = [];

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredientsTable) => {
      if (!ingredients.includes(ingredientsTable.ingredient.toLowerCase())) {
        ingredients.push(ingredientsTable.ingredient.toLowerCase());
      }
    });

    recipe.ustensils.forEach((utensil) => {
      if (!utensils.includes(utensil.toLowerCase())) {
        utensils.push(utensil.toLowerCase());
      }
    });

    if (!appliances.includes(recipe.appliance.toLowerCase())) {
      appliances.push(recipe.appliance.toLowerCase());
    }
  });

  const ingredientsList = document.querySelector(".ingredients .items-list");
  const utensilsList = document.querySelector(".ustensils .items-list");
  const appliancesList = document.querySelector(".appliances .items-list");

  ingredients.forEach((ingredient) => {
    const listItem = document.createElement("li");
    const itemName = document.createElement("span");
    itemName.textContent = ingredient;
    listItem.appendChild(itemName);
    listItem.innerHTML += `<i class="fa-solid fa-xmark clear-filter"></i>`;
    ingredientsList.appendChild(listItem);
  });

  [...ingredientsList.children]
    .sort((a, b) => (a.innerText > b.innerText ? 1 : -1))
    .forEach((node) => ingredientsList.appendChild(node));

  utensils.forEach((utensil) => {
    const listItem = document.createElement("li");
    const itemName = document.createElement("span");
    itemName.textContent = utensil;
    listItem.appendChild(itemName);
    listItem.innerHTML += `<i class="fa-solid fa-xmark clear-filter"></i>`;
    utensilsList.appendChild(listItem);
  });

  [...utensilsList.children]
    .sort((a, b) => (a.innerText > b.innerText ? 1 : -1))
    .forEach((node) => utensilsList.appendChild(node));

  appliances.forEach((appliance) => {
    const listItem = document.createElement("li");
    const itemName = document.createElement("span");
    itemName.textContent = appliance;
    listItem.appendChild(itemName);
    listItem.innerHTML += `<i class="fa-solid fa-xmark clear-filter"></i>`;
    appliancesList.appendChild(listItem);
  });

  [...appliancesList.children]
    .sort((a, b) => (a.innerText > b.innerText ? 1 : -1))
    .forEach((node) => appliancesList.appendChild(node));
}

export { createItemsList };
