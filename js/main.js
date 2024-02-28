import { getRecipes } from "./getRecipes.js";
import { maxLength } from "./maxLength.js";
import { filterListItems } from "./filterListItems.js";

async function filterWithSearchbar(searchInput) {
  let recipes = await getRecipes();

  let filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchInput.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(searchInput.toLowerCase())
      )
  );
  return filteredRecipes;
}

async function filterWithItems(recipes) {
  const { ingredients, appliances, ustensils } = advancedFilters;
  let filteredRecipes = [];
  recipes.forEach((recipe) => {
    let hasIngredients = true;
    if (ingredients.length) {
      hasIngredients = ingredients.some((selectedIngredient) =>
        recipe.ingredients.some(
          (recipeIngredient) =>
            recipeIngredient.ingredient.toLowerCase() ===
            selectedIngredient.toLowerCase()
        )
      );
    }

    let hasAppliance = true;
    if (appliances.length) {
      hasAppliance = appliances.some(
        (selectedAppliance) =>
          recipe.appliance.toLowerCase() === selectedAppliance.toLowerCase()
      );
    }

    let hasUstensils = true;
    if (ustensils.length) {
      hasUstensils = ustensils.some((selectedUtensil) =>
        recipe.ustensils.some(
          (recipeUtensil) =>
            recipeUtensil.toLowerCase() === selectedUtensil.toLowerCase()
        )
      );
    }

    if (hasIngredients && hasAppliance && hasUstensils) {
      filteredRecipes.push(recipe);
    }
  });
  return filteredRecipes;
}

async function filterRecipes(searchInput) {
  if (searchInput.length > 2) {
    let filteredRecipes = await filterWithSearchbar(searchInput);
    if (
      advancedFilters.ingredients.length ||
      advancedFilters.appliances.length ||
      advancedFilters.ustensils.length
    ) {
      filteredRecipes = await filterWithItems(filteredRecipes);
    }

    document.querySelector(".recipes").innerHTML = "";
    displayRecipes(filteredRecipes);
    filterListItems(filteredRecipes);
  }
}

function displayRecipes(recipes) {
  let recipeSection = document.querySelector(".recipes");
  let errorMessage = document.querySelector(".no-recipe");
  errorMessage.innerHTML = "";

  if (!recipes.length) {
    let searchInput = document.querySelector(".search-input").value;
    errorMessage.innerHTML = `Aucune recette ne contient "${searchInput}" vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
  }

  recipes.forEach((recipe) => {
    let path = `/images/Photos/${recipe.image}`;
    let article = document.createElement("article");
    article.innerHTML = `<img src="${path}"/>
        <div>
            <h3>${recipe.name}</h3>
            <h4>Recette</h4>
            <p class="recipe-description">${recipe.description}</p>
            <h4>Ingredients</h4>
            <ul>
                ${recipe.ingredients
                  .map((ingredient) => {
                    let ingredientText = ingredient.ingredient || "";
                    let quantityText = ingredient.quantity || "";
                    let unitText = ingredient.unit || "";

                    if (ingredientText || quantityText || unitText) {
                      return `<li>${ingredientText}<span>${quantityText} ${unitText}</span></li>`;
                    } else {
                      return "";
                    }
                  })
                  .join("")}
            </ul>

        </div>`;
    maxLength(".recipe-description", 200);
    recipeSection.append(article);
  });
}

function displayListItems(element) {
  let listItems = element.querySelector(".list-items");
  let arrow = element.querySelector(".arrow");

  if (listItems.style.display == "block") {
    listItems.style.display = "none";
    arrow.style.transformOrigin = "center";
    arrow.style.transform = "rotate(0deg)";
  } else {
    listItems.style.display = "block";
    arrow.style.transformOrigin = "center";
    arrow.style.transform = "rotate(180deg)";
  }
}

function createFilterTags(category) {
  let itemCategory = category.classList[1];
  let items = document.querySelectorAll(`.${itemCategory} .list-items li`);
  items.forEach((item) => {
    let filter = document.createElement("p");
    filter.className = "filter";
    filter.innerHTML = `${item.innerText}<i class="fa-solid fa-xmark clear-filter"></i>`;
    filter.dataset.click = 0;
    selectFilterTag(filter, item, itemCategory);
    clearFilterTag(filter, item);
  });
}

function selectFilterTag(filter, item, category) {
  item.addEventListener("click", async () => {
    let itemName = item.innerText;

    if (filter.dataset.click == 0) {
      document.querySelector(".selected ." + category).append(filter);
      filter.dataset.click = 1;

      advancedFilters[category].push(itemName);
      let searchInput = document
        .querySelector(".search-input")
        .value.toLowerCase();
      await filterRecipes(searchInput);
    }
  });
}

function clearFilterTag(filter, item) {
  filter.querySelector(".clear-filter").addEventListener("click", async () => {
    filter.dataset.click = 0;
    filter.remove();

    for (const category in advancedFilters) {
      advancedFilters[category] = advancedFilters[category].filter(
        (filter) => filter !== item.innerText
      );
    }

    let searchInput = document
      .querySelector(".search-input")
      .value.toLowerCase();
    await filterRecipes(searchInput);
  });
}

//FIXME: clearInput returns every item to the list instead of the ones that match the search and recipes
function clearInput(element, input, items) {
  element.querySelector(".clear-button").addEventListener("click", () => {
    input.value = "";
    items.forEach((item) => {
      item.style.display = "block";
    });
  });
}

async function init() {
  let recipes = await getRecipes();
  displayRecipes(recipes);

  let mainSearchbar = document.querySelector(".main-searchbar");

  mainSearchbar
    .querySelector(".search-button")
    .addEventListener("click", async () => {
      let searchInput = document
        .querySelector(".search-input")
        .value.toLowerCase();
      await filterRecipes(searchInput);
    });

  mainSearchbar.querySelector(".clear-button").addEventListener("click", () => {
    mainSearchbar.querySelector("input").value = "";
    document.querySelector(".recipes").innerHTML = "";
    displayRecipes(recipes);
  });

  let ingredients = document.querySelector(".ingredients");
  ingredients.querySelector("button").addEventListener("click", () => {
    displayListItems(ingredients);
  });
  createFilterTags(ingredients);

  let appliances = document.querySelector(".appliances");
  appliances.querySelector("button").addEventListener("click", () => {
    displayListItems(appliances);
  });
  createFilterTags(appliances);

  let ustensils = document.querySelector(".ustensils");
  ustensils.querySelector("button").addEventListener("click", () => {
    displayListItems(ustensils);
  });
  createFilterTags(ustensils);
}

let advancedFilters = { ingredients: [], appliances: [], ustensils: [] };

init();
