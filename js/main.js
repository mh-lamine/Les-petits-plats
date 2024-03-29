import { getRecipes } from "./getRecipes.js";
import { maxLength } from "./maxLength.js";
import { filterListItems } from "./filterListItems.js";
import { updateTagsList } from "./updateTagsList.js";
import { createItemsList } from "./createItemsList.js";

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
      hasIngredients = ingredients.every((selectedIngredient) =>
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
    document.querySelector(
      ".nb-de-recettes"
    ).innerText = `${recipes.length} recettes`;
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

    document.querySelector(
      ".nb-de-recettes"
    ).innerText = `${recipes.length} recettes`;
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
    selectFilterTag(filter, item, itemCategory);
    clearFilterTag(filter, item);
  });
}

function selectFilterTag(filter, item, category) {
  item.querySelector("span").addEventListener("click", async () => {
    let itemName = item.innerText;

    document.querySelector(".selected ." + category).append(filter);

    // document.querySelectorAll(".items-list").forEach((itemsList) => {
    //   let items = itemsList.querySelectorAll("li:not(.hidden)");
    //   items.forEach((item) => {
    //     item.style.display = "block";
    //   });
    // });

    document.querySelector(`.${category} .list-items`).style.display = "none";
    // document.querySelector(`.${category} input`).value = "";
    // document.querySelector(`.${category} .clear-button`).style.display = "none";
    document.querySelector(`.${category} .clear-button`).click();
    document.querySelector(`.${category} .arrow`).style.transform =
      "rotate(0deg)";
    document.querySelector(`.${category} .active-section`).appendChild(item);
    advancedFilters[category].push(itemName);
    await filterRecipes();
  });
}

function removeFilterTag(filter, item) {
  for (const category in advancedFilters) {
    advancedFilters[category] = advancedFilters[category].filter(
      (filter) => filter !== item.innerText
    );
  }
  
  item.parentElement.parentElement.querySelector(".items-list").append(item);
  filter.remove();
  
  const list = item.parentElement;
  [...list.children]
    .sort((a, b) => (a.innerText > b.innerText ? 1 : -1))
    .forEach((node) => list.appendChild(node));
}

function clearFilterTag(filter, item) {
  filter.querySelector(".clear-filter").addEventListener("click", async () => {
    removeFilterTag(filter, item);
    await filterRecipes();
  });
  item.querySelector(".clear-filter").addEventListener("click", async () => {
    removeFilterTag(filter, item);
    await filterRecipes();
  });
}

async function init() {
  let recipes = await getRecipes();
  displayRecipes(recipes);
  createItemsList(recipes);

  let mainSearchbar = document.querySelector(".main-searchbar");

  mainSearchbar
    .querySelector("input")
    .addEventListener("input", async () => {
      if (mainSearchbar.querySelector("input").value.length >= 3) {
        await filterRecipes();
      } else {
        document.querySelector(".recipes").innerHTML = "";
        displayRecipes(recipes);
        updateTagsList(recipes);
      }
      if (mainSearchbar.querySelector("input").value.length) {
        mainSearchbar.querySelector(".clear-button").style.display = "block";
      } else {
        mainSearchbar.querySelector(".clear-button").style.display = "none";
      }
    });

  

  mainSearchbar.querySelector(".clear-button").addEventListener("click", () => {
    mainSearchbar.querySelector("input").value = "";
    document.querySelector(".recipes").innerHTML = "";
    filterRecipes();
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
