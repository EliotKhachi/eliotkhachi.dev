const darkColor = "#090a0f";
const primaryColor = "#a3acce";
let jsonData;
async function fetchData() {
  try {
    const response = await fetch("../resources/zettels.json");
    jsonData = await response.json();
    createTags();
    renderZettels();
  } catch (error) {
    console.error("Error fetching JSON data:", error);
  }
}

const tagInput = document.getElementById("tagInput");
tagInput.value = "";
tagInput.addEventListener("input", renderZettels);
const availableTagsDiv = document.getElementById("available-tags");
let previousLitTag = document.createElement("button");

function renderTag(tag) {
  if (tag.getAttribute("isClicked") === "true") {
    tag.style.color = darkColor;
    tag.style.backgroundColor = primaryColor;
  } else {
    tag.style.color = primaryColor;
    tag.style.backgroundColor = "transparent";
  }
}

function createTags() {
  const availableTags = jsonData.registry;
  availableTags.forEach((item) => {
    const tag = document.createElement("button");
    tag.textContent = item;
    tag.id = "tag";
    tag.setAttribute("isClicked", "false");
    tag.addEventListener("click", function () {
      if (tag.getAttribute("isClicked") === "true") {
        tag.setAttribute("isClicked", false);
      } else {
        tag.setAttribute("isClicked", true);
      }
      const selectedTags = Array.from(availableTagsDiv.children).filter(
        function (tag) {
          return tag.getAttribute("isClicked") === "true";
        }
      );

      tagInput.value = selectedTags.map((tag) => tag.textContent).join(", ");
      renderZettels();
      renderTag(tag);
    });

    availableTagsDiv.appendChild(tag);
  });
}

function renderZettels() {
  const inputValue = tagInput.value;
  const resultDiv = document.getElementById("result");
  if (inputValue == "") {
    resultDiv.innerHTML = "";
    return;
  }

function clearInput() {
  document.getElementById.innerHTML = "";
  inputValue ="";
}

  // Clear the previous results
  resultDiv.innerHTML = "";

  // Filter JSON objects based on the entered tag
  const inputValuesArray = inputValue.split(", ").map((value) => value.trim());
  console.log(inputValuesArray);
  let filteredData = jsonData.zettels;
  for (string of inputValuesArray) {
    filteredData = filteredData.filter((zettel) => {
      const passesFilter = zettel.tags.some((tag) => {
        return tag.includes(string);
      });
      return passesFilter;
    });
  }

  // Render the matching objects
  if (filteredData.length > 0) {
    filteredData.forEach((item) => {
      const link = document.createElement("a");
      link.textContent = item.title;
      link.href = "../zettelkasten/" + item.id + ".html";
      link.id = "zettel-link";
      const linkTags = document.createElement("p");
      linkTags.textContent = "#" + item.tags.join(" #");
      linkTags.id = "zettel-link-tags";
      link.appendChild(linkTags);
      resultDiv.appendChild(link);
    });
  } else {
    resultDiv.textContent = "";
  }
}

fetchData();
renderZettels();
