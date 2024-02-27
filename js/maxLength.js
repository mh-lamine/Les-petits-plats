function maxLength(text, maxLength) {
  let longText = document.querySelectorAll(text);

  longText.forEach((element) => {
    let text = element.textContent;

    if (text.length > maxLength) {
      element.textContent = text.substring(0, maxLength) + "...";
    }
  });
}

export { maxLength };