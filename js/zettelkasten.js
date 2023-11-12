const darkColor = "#090a0f";
const primaryColor = "#a3acce";

// RENDER TAGS
let jsonData;
async function fetchData() {
  try {
    const response = await fetch("../resources/zettels.json");
    jsonData = await response.json();
    createTags();
    renderObjects();
  } catch (error) {
    console.error("Error fetching JSON data:", error);
  }
}

const tagInput = document.getElementById("tagInput");
tagInput.value = "";
tagInput.addEventListener("input", renderObjects);
const availableTagsDiv = document.getElementById("available-tags");
let previousLitTag = document.createElement("button");

function renderTags(previousLitTag, litTag) {
  previousLitTag.style.color = primaryColor;
  previousLitTag.style.backgroundColor = "transparent";

  litTag.style.color = darkColor;
  litTag.style.backgroundColor = primaryColor;
}

function createTags() {
  const availableTags = jsonData.registry;
  availableTags.forEach((item) => {
    const tag = document.createElement("button");
    tag.textContent = item;
    tag.id = "tag";
    tag.setAttribute("isClicked", "false");
    tag.addEventListener("click", function () {
      tag.setAttribute("isClicked", "true");
      tagInput.value = tag.textContent.slice(0);
      renderObjects();
      renderTags(previousLitTag, tag);
      previousLitTag = tag;
    });

    availableTagsDiv.appendChild(tag);
  });
}

function renderObjects() {
  const inputValue = tagInput.value;
  const resultDiv = document.getElementById("zettels");
  if (inputValue == "") {
    resultDiv.innerHTML = "";
    return;
  }

  // RENDER ZETTELS
  // Clear the previous results
  resultDiv.innerHTML = "";

  // Filter JSON objects based on the entered tag
  const filteredData = jsonData.zettels.filter((item) => {
    return item.tags.some((tag) =>
      tag.toLowerCase().includes(inputValue.toLowerCase())
    );
  });

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
renderObjects();

// BLINKING HEADER
const phrases = [
  " Second Brain",
  " Web of Knowledge",
  " Zettelkasten",
];
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function typeText() {
  const textContainer = document.getElementById("blinking-header-text");
  const cursor = document.getElementById("cursor");

  const currentPhrase = phrases[currentPhraseIndex];

  if (isDeleting) {
    // If we're at the last phrase, remove the cursor and exit the function.
    if (currentPhraseIndex === phrases.length - 1) {
      document.getElementById('cursor').classList.toggle('styleChanged');
      return;
    }
    textContainer.textContent = currentPhrase.substring(
      0,
      currentCharIndex - 1
    );
    currentCharIndex--;

    if (currentCharIndex === 0) {
      isDeleting = false;
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;

      // Add a delay after fully deleting the text
      setTimeout(() => {
        setTimeout(typeText, 500);
      }, 1000);
    } else {
      setTimeout(typeText, 100);
    }
  } else {
    textContainer.textContent = currentPhrase.substring(
      0,
      currentCharIndex + 1
    );
    currentCharIndex++;

    if (currentCharIndex > currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeText, 500);
    } else {
      setTimeout(typeText, 100);
    }
  }
}

document.addEventListener("DOMContentLoaded", setTimeout(typeText, 1000));