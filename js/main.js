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

function filterRecipes(recipes) {

    let filteredRecipes = [];

    document.querySelector(".search-button").addEventListener("click", () => {
        let filteredRecipes = [];
        let searchInput = document.querySelector(".search-input").value.toLowerCase();
        for (let i = 0; i < recipes.length; i++) {
            let recipeName = recipes[i].name.toLowerCase();
            if (recipeName.includes(searchInput)) {
                filteredRecipes.push(recipes[i])
            }
        }
        document.querySelector(".recipes").innerHTML = "";
        displayRecipes(filteredRecipes)
    })

    /* 
        branch le code, changer tous les foreach pour la version basique 
        rechercher "supprimer un element dans une liste" pour les items
        verbe + sur quoi ça s'applique = nom de fonction
    */

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
        let filter = document.createElement("p");
        filter.setAttribute("class", "filter")
        filter.dataset.click = 0;
        filter.innerHTML = `${item.innerText}<i class="fa-solid fa-xmark clear-filter"></i>`;
        
        item.addEventListener("click", () => {
            if (filter.dataset.click == 0) {
                selected.innerHTML += `<p class="filter">${item.innerText}<i class="fa-solid fa-xmark clear-filter"></i></p>`
                let clearFilter = document.querySelector(".clear-filter");
                filter.dataset.click = 1;
                clearFilter.addEventListener("click", () => {
                    filter.remove()
                    filter.dataset.click = 0;
                });
            } 
        })
    });

    let clearBtn = element.querySelector(".clear-button");
    clearBtn.addEventListener("click", () => {
        input.value = "";
        items.forEach(item => {
            let itemName = item.textContent.toLowerCase();
            item.style.display = "block";
        });
    })
}

function addClickEventToButton(element) {
    element.querySelector("button").addEventListener("click", () => {
      displayListItems(element);
    });
}

async function init() {

    let recipes = await getRecipes();

    displayRecipes(recipes);
      
    let ingredients = document.querySelector(".ingredients");
    addClickEventToButton(ingredients);
    filterItems(ingredients);
    
    let appareils = document.querySelector(".appareils");
    addClickEventToButton(appareils);
    filterItems(appareils);
    
    let ustensils = document.querySelector(".ustensils");
    addClickEventToButton(ustensils);
    filterItems(ustensils);
    
    filterRecipes(recipes);
}

init();