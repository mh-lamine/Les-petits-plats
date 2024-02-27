async function getRecipes() {
  const response = await fetch("../assets/recipes.js");
  const data = await response.json();
  return data;
}

export { getRecipes };