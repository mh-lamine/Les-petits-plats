async function getRecipes() {
  const response = await fetch("../assets/recipes.js");
  const data = await response.json();
  return data;
}

function maxLength(text, maxLength) {
  let longText = document.querySelectorAll(text);

  longText.forEach((element) => {
    let text = element.textContent;

    if (text.length > maxLength) {
      element.textContent = text.substring(0, maxLength) + "...";
    }
  });
}

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

async function filterRecipes(searchInput, advancedFilters, isAdvancedSearch) {
  if (searchInput.length > 2) {
    // let recipes = isAdvancedSearch ? filteredRecipes : await getRecipes();
    let recipes = await getRecipes();
    let filteredRecipes = recipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchInput.toLowerCase()) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient
            .toLowerCase()
            .includes(searchInput.toLowerCase())
        )
    );

    const { ingredients, appliances, ustensils } = advancedFilters;

    if (ingredients.length || appliances.length || ustensils.length) {
      console.log(ingredients, appliances, ustensils);
      const uniqueRecipeIds = new Set();

      filteredRecipes = filteredRecipes.filter((recipe) => {
        const hasIngredients = ingredients.some((selectedIngredient) =>
          recipe.ingredients.some(
            (recipeIngredient) =>
              recipeIngredient.ingredient.toLowerCase() ===
              selectedIngredient.toLowerCase()
          )
        );
        if (!hasIngredients) {
          return true;
        }

        
        const hasAppliance = appliances.some(
          (selectedAppliance) =>
            recipe.appliance.toLowerCase() === selectedAppliance.toLowerCase()
        );
        if (!hasAppliance) {
          return true;
        }

        const hasUstensils = ustensils.some((selectedUtensil) =>
          recipe.ustensils.some(
            (recipeUtensil) =>
              recipeUtensil.toLowerCase() === selectedUtensil.toLowerCase()
          )
        );
        if (!hasUstensils) {
          return true;
        }

        const isUnique = uniqueRecipeIds.has(recipe.id);
        if (!isUnique) {
          uniqueRecipeIds.add(recipe.id);
        }

        // si il n'y a pas de filtre selectionné, alors c'est vrai par defaut

        return hasIngredients || hasAppliance || hasUstensils;
      });
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
    path = `/images/Photos/${recipe.image}`;
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

function addFilter(elt, item) {
  advancedFilters[elt].push(item);
}

function removeFilter(advancedFilters, item) {
  for (const category in advancedFilters) {
    advancedFilters[category] = advancedFilters[category].filter(
      (filter) => filter !== item
    );
  }
}

function filterItems(element) {
  let input = element.querySelector("input");
  let items = element.querySelectorAll(".list-items li");

  input.addEventListener("input", () => {
    let search = input.value.toLowerCase();

    items.forEach((item) => {
      let itemName = item.textContent.toLowerCase();
      let show = itemName.includes(search);

      if (show) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });

  items.forEach((item) => {
    let elt = element.classList[1];
    let selected = document.querySelector(".selected ." + elt);
    let filter = document.createElement("p");
    filter.className = "filter";
    filter.dataset.click = 0;
    filter.innerHTML = `${item.innerText}<i class="fa-solid fa-xmark clear-filter"></i>`;

    item.addEventListener("click", async () => {
      item = item.innerText;

      if (filter.dataset.click == 0) {
        selected.append(filter);
        filter.dataset.click = 1;

        addFilter(elt, item);
        let searchInput = document
          .querySelector(".search-input")
          .value.toLowerCase();
        await filterRecipes(searchInput, advancedFilters, true);

        filter
          .querySelector(".clear-filter")
          .addEventListener("click", async () => {
            filter.dataset.click = 0;
            filter.remove();

            removeFilter(advancedFilters, item);
            let searchInput = document
              .querySelector(".search-input")
              .value.toLowerCase();
            await filterRecipes(searchInput, advancedFilters, false);
          });
      }
    });
  });

  element.querySelector(".clear-button").addEventListener("click", () => {
    input.value = "";
    items.forEach((item) => {
      let itemName = item.textContent.toLowerCase();
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
      await filterRecipes(searchInput, advancedFilters, false);
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
  filterItems(ingredients);

  let appliances = document.querySelector(".appliances");
  appliances.querySelector("button").addEventListener("click", () => {
    displayListItems(appliances);
  });
  filterItems(appliances);

  let ustensils = document.querySelector(".ustensils");
  ustensils.querySelector("button").addEventListener("click", () => {
    displayListItems(ustensils);
  });
  filterItems(ustensils);
}

let advancedFilters = { ingredients: [], appliances: [], ustensils: [] };

init();
