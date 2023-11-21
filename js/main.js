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

async function filterRecipes() {

    let recipes = await getRecipes();

    let filteredRecipes = [];

    let mainSearchbar = document.querySelector(".main-searchbar");

    mainSearchbar.querySelector(".search-button").addEventListener("click", () => {
        console.log('click')
        let filteredRecipes = [];
        let searchInput = document.querySelector(".search-input").value.toLowerCase();
        recipes.forEach(recipe => {
            let recipeName = recipe.name.toLowerCase();
            if (recipeName.includes(searchInput)) {
                filteredRecipes.push(recipe)
            }
        });
        document.querySelector(".recipes").innerHTML = "";
        displayRecipes(filteredRecipes)
        return filteredRecipes
    })

    mainSearchbar.querySelector(".clear-button").addEventListener("click", () => {
        mainSearchbar.querySelector("input").value = "";
        document.querySelector(".recipes").innerHTML = "";
        displayRecipes(recipes)
    })
}

async function filterWithItem() {
    let recipes = await filterRecipes();
    console.log(recipes)
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

async function filterItems(element) {
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

            if (filter.dataset.click == 0) {
                selected.append(filter);
                filter.dataset.click = 1;

                // add to advancedFilters array

                filter.querySelector(".clear-filter").addEventListener("click", () => {
                    filter.style.display = "none";
                    filter.dataset.click = 0;

                    // remove to advancedFilters array

                });
            }

            // return advancedFilters

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
      
    let ingredients = document.querySelector(".ingredients");
    ingredients.querySelector("button").addEventListener("click", () => {
        displayListItems(ingredients);
      });
    filterItems(ingredients);
    
    let appareils = document.querySelector(".appareils");
    appareils.querySelector("button").addEventListener("click", () => {
        displayListItems(appareils);
      });    
    filterItems(appareils);
    
    let ustensils = document.querySelector(".ustensils");
    ustensils.querySelector("button").addEventListener("click", () => {
        displayListItems(ustensils);
      });    
    filterItems(ustensils);

    filterRecipes()
    
}

init();