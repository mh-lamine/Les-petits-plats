function filterListItems() {
  let listItems = document.querySelectorAll(".list-items");

  listItems.forEach((item) => {
    let listItemInput = item.querySelector("input");
    let itemsList = item.querySelectorAll(".items-list li:not(.hidden)");

    listItemInput.addEventListener("input", () => {
      item.querySelector(".clear-button").style.display = `${
        listItemInput.value ? "block" : "none"
      }`;
      let search = listItemInput.value.toLowerCase();

      itemsList.forEach((ListElement) => {
        let itemName = ListElement.innerText.toLowerCase();
        let show = itemName.includes(search);
        if (!show) {
          ListElement.classList.add("more-hidden");
        } else {
          ListElement.classList.remove("more-hidden");
        }
      });
    });
    item.querySelector(".clear-button").addEventListener("click", () => {
      listItemInput.value = "";
      itemsList.forEach((item) => {
        item.classList.remove("more-hidden");
      });
      item.querySelector(".clear-button").style.display = "none";
    });
  });
}

export { filterListItems };
