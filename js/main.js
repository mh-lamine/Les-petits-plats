async function getRecipes() {
    const response = await fetch("../assets/recipes.js");
    const data = await response.json();
    return data;
}

function maxLength(text, maxLength) {
    let longText = document.querySelectorAll(text);
  
    longText.forEach(element => {
      let text = element.textContent;
  
      if (text.length > maxLength) {
        element.textContent = text.substring(0, maxLength) + '...';
      }
    });
}

async function filterRecipes(searchInput) {
    if(searchInput.length > 2) {
        let recipes = await getRecipes();
        let filteredRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchInput.toLowerCase()) || recipe.description.toLowerCase().includes(searchInput.toLowerCase()) || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchInput.toLowerCase()) ));
        console.log(filteredRecipes)
        document.querySelector(".recipes").innerHTML = "";
        displayRecipes(filteredRecipes)
    }
}

async function filterWithItem(advancedFilters) {

    let recipes = await getRecipes();

    const { ingredients, appliances, ustensils } = advancedFilters;
  
    const uniqueRecipeIds = new Set();
    console.log(ingredients.length, appliances.length, ustensils.length)
  
    if (ingredients.length || appliances.length || ustensils.length) {
        const filteredRecipes = recipes.filter(recipe => {
          // Check if at least one selected ingredient is present in the recipe
          const hasIngredients = ingredients.some(selectedIngredient =>
            recipe.ingredients.some(
              recipeIngredient =>
                recipeIngredient.ingredient.toLowerCase() ===
                selectedIngredient.toLowerCase()
            )
          );
      
          // Check if the selected appliance is used in the recipe
          const hasAppliance = appliances.includes(
            recipe.appliance
          );
      
          // Check if at least one selected utensil is used in the recipe
          const hasUtensils = ustensils.some(selectedUtensil =>
            recipe.ustensils.some(
              recipeUtensil =>
                recipeUtensil.toLowerCase() === selectedUtensil.toLowerCase()
            )
          );
      
          // Check if the recipe ID is unique and add it to the set
          const isUnique = uniqueRecipeIds.has(recipe.id);
          if (!isUnique) {
            uniqueRecipeIds.add(recipe.id);
          }
      
          // Return true if at least one of the criteria is met
          return hasIngredients || hasAppliance || hasUtensils;
        });

        document.querySelector(".recipes").innerHTML = "";
        displayRecipes(filteredRecipes)
    } else {
        document.querySelector(".recipes").innerHTML = "";
        displayRecipes(recipes)
    }
}

function displayRecipes(recipes) {

    let recipeSection = document.querySelector(".recipes");
    
    recipes.forEach((recipe) => {

        path = `/images/Photos/${recipe.image}`;
        let article = document.createElement("article");
        article.innerHTML = 
        `<img src="${path}"/>
        <div>
            <h3>${recipe.name}</h3>
            <h4>Recette</h4>
            <p class="recipe-description">${recipe.description}</p>
            <h4>Ingredients</h4>
            <ul>
                ${
                    recipe.ingredients.map((ingredient) => {
                        let ingredientText = ingredient.ingredient || ''; 
                        let quantityText = ingredient.quantity || '';
                        let unitText = ingredient.unit || '';

                        if (ingredientText || quantityText || unitText) {
                            return `<li>${ingredientText}<span>${quantityText} ${unitText}</span></li>`;
                        } else {
                            return ''; 
                        }
                    }).join('')
                }
            </ul>

        </div>`;
        maxLength(".recipe-description", 200);
        recipeSection.append(article);
    })
}

function displayListItems(element){

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
    advancedFilters[elt].push(item)
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
        
        items.forEach(item => {
            let itemName = item.textContent.toLowerCase();
            if (itemName.includes(search)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });

    items.forEach(item => {
        let elt = element.classList[1]; 
        let selected = document.querySelector(".selected ." + elt);
        let filter = document.createElement('p');
        filter.className = 'filter';
        filter.dataset.click = 0;
        filter.innerHTML = `${item.innerText}<i class="fa-solid fa-xmark clear-filter"></i>`;

        item.addEventListener("click", () => {
            console.log(item)

            item = item.innerText;

            if (filter.dataset.click == 0) {
                selected.append(filter);
                filter.dataset.click = 1;

                // add to advancedFilters array
                addFilter(elt, item)
                filterWithItem(advancedFilters)

                filter.querySelector(".clear-filter").addEventListener("click", () => {
                filter.dataset.click = 0;
                filter.remove()

                    // remove from advancedFilters array
                    removeFilter(advancedFilters, item)
                    filterWithItem(advancedFilters)
                });
            }
        })
    });

    element.querySelector(".clear-button").addEventListener("click", () => {
        input.value = "";
        items.forEach(item => {
            let itemName = item.textContent.toLowerCase();
            item.style.display = "block";
        });
    })
}

async function init() {
    let recipes = await getRecipes();
    displayRecipes(recipes);
    
    let mainSearchbar = document.querySelector(".main-searchbar");
    
    mainSearchbar.querySelector(".search-button").addEventListener("click", async () => {
        let searchInput = document.querySelector(".search-input").value.toLowerCase();
        await filterRecipes(searchInput)
    })

    mainSearchbar.querySelector(".clear-button").addEventListener("click", () => {
        mainSearchbar.querySelector("input").value = "";
        document.querySelector(".recipes").innerHTML = "";
        displayRecipes(recipes)
    })

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
let advancedFilters = {ingredients: [], appliances: [], ustensils: []};

init();