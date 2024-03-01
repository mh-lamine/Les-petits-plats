function filterListItems() {
  let listItems = document.querySelectorAll(".list-items");

  listItems.forEach((listItem) => {
    listItem.querySelector("input").addEventListener("input", () => {
      listItem.querySelector(".clear-button").style.display = `${
        listItem.querySelector("input").value ? "block" : "none"
      }`;
      let items = listItem.querySelectorAll("li:not(.hidden)");
      let search = listItem.querySelector("input").value.toLowerCase();
      items.forEach((item) => {
        let itemName = item.textContent.toLowerCase();
        let show = itemName.includes(search);

        if (!show) {
          item.style.display = "none";
        } else {
          item.style.display = "block";
        }
      });
    });
    listItem.querySelector(".clear-button").addEventListener("click", () => {
      listItem.querySelector("input").value = "";
      let items = listItem.querySelectorAll("li:not(.hidden)");
      items.forEach((item) => {
        item.style.display = "block";
      });
    });
  });
}

export { filterListItems };
