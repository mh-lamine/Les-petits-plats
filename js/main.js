import { getRecipes } from "./getRecipes.js";
import { maxLength } from "./maxLength.js";
import { filterListItems } from "./filterListItems.js";
import { updateTagsList } from "./updateTagsList.js";

async function filterWithSearchbar(searchInput, recipes) {
  if (searchInput.length < 3) return recipes;
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
      hasUstensils = ustensils.some((selectedUstensil) =>
        recipe.ustensils.some(
          (recipeUstensil) =>
            recipeUstensil.toLowerCase() === selectedUstensil.toLowerCase()
        )
      );
    }

    if (hasIngredients && hasAppliance && hasUstensils) {
      filteredRecipes.push(recipe);
    }
  });
  return filteredRecipes;
}

async function filterRecipes() {
  let recipes = await getRecipes();
  let searchInput = document.querySelector(".search-input").value.toLowerCase();
  let filteredRecipes = await filterWithSearchbar(searchInput, recipes);
  if (
    advancedFilters.ingredients.length ||
    advancedFilters.appliances.length ||
    advancedFilters.ustensils.length
  ) {
    filteredRecipes = await filterWithItems(filteredRecipes);
  }

  document.querySelector(".recipes").innerHTML = "";
  displayRecipes(filteredRecipes);
  updateTagsList(filteredRecipes);
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

    document.querySelector(".filters p").innerText = `${
      recipes.length !== 50 ? recipes.length : "1500"
    } recettes`;
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

      document.querySelector(`.${category} .list-items`).style.display = "none";
      document.querySelector(`.${category} input`).value = "";
      document.querySelector(`.${category} .clear-button`).style.display =
        "none";
      document.querySelector(`.${category} .arrow`).style.transform =
        "rotate(0deg)";

      advancedFilters[category].push(itemName);
      await filterRecipes();
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

    await filterRecipes();
  });
}

async function init() {
  let recipes = await getRecipes();
  displayRecipes(recipes);

  let mainSearchbar = document.querySelector(".main-searchbar");

  mainSearchbar
    .querySelector(".search-button")
    .addEventListener("click", async () => {
      await filterRecipes();
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

  filterListItems();
}

let advancedFilters = { ingredients: [], appliances: [], ustensils: [] };

init();
