const fromLanguage = document.getElementById("fromLanguage");
const toLanguage = document.getElementById("toLanguage");
const swapButton = document.getElementById("swapButton");
const phrase = document.getElementById("phrase");
const characterCount = document.getElementById("characterCount");
const clearButton = document.getElementById("clearButton");
const generateButton = document.getElementById("generateButton");
const buttonIcon = document.getElementById("buttonIcon");
const buttonText = document.getElementById("buttonText");
const errorMessage = document.getElementById("errorMessage");

const resultSection = document.getElementById("resultSection");
const originalText = document.getElementById("originalText");
const translationText = document.getElementById("translationText");
const originalLanguageLabel = document.getElementById("originalLanguageLabel");
const translationLanguageLabel = document.getElementById("translationLanguageLabel");

const copyButton = document.getElementById("copyButton");

const languages = {
en: "English",
es: "Spanish",
fr: "French",
de: "German",
it: "Italian",
pt: "Portuguese",
nl: "Dutch",
pl: "Polish",
ru: "Russian",
uk: "Ukrainian"
};

let currentTranslation = "";

function updateCount() {
characterCount.textContent =
phrase.value.length + " / 500";
}

function updateLabels() {
originalLanguageLabel.textContent =
languages[fromLanguage.value].toUpperCase();

translationLanguageLabel.textContent =
languages[toLanguage.value].toUpperCase();
}

function error(message) {
errorMessage.textContent = message;
}

function clearError() {
errorMessage.textContent = "";
}

function loading(value) {
generateButton.disabled = value;

if (value) {
buttonIcon.textContent = "◌";
buttonText.textContent = "Translating...";
} else {
buttonIcon.textContent = "✦";
buttonText.textContent = "Generate Study Card";
}
}

async function generate() {
clearError();

const text = phrase.value.trim();

if (!text) {
error("Please enter a word or phrase.");
return;
}

const from = fromLanguage.value;
const to = toLanguage.value;

if (from === to) {
error("Please choose two different languages.");
return;
}

loading(true);

try {
const response = await fetch(
"/api/translate",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
text: text,
pair: from + "-" + to
})
}
);

const data = await response.json();

if (!response.ok) {
  throw new Error(
    data.error || "Translation failed."
  );
}

if (!data.translation) {
  throw new Error(
    "No translation was returned."
  );
}

currentTranslation = data.translation;

originalText.textContent = text;
translationText.textContent =
  data.translation;

updateLabels();

resultSection.classList.remove("hidden");

} catch (e) {
console.error(e);
error(e.message);
}

loading(false);
}

/*
Generate when the button is clicked.
*/
generateButton.addEventListener(
"click",
generate
);

/*
IMPORTANT:
Pasting text only puts text into the box.
It does NOT automatically translate.

This makes the app detect paste correctly
and update the character counter.
*/
phrase.addEventListener(
"paste",
function () {
setTimeout(function () {
updateCount();
clearError();
}, 50);
}
);

phrase.addEventListener(
"input",
function () {
updateCount();
clearError();
}
);

phrase.addEventListener(
"keydown",
function (event) {
if (
event.key === "Enter" &&
(event.ctrlKey || event.metaKey)
) {
event.preventDefault();
generate();
}
}
);

clearButton.addEventListener(
"click",
function () {
phrase.value = "";
updateCount();
clearError();
resultSection.classList.add("hidden");
phrase.focus();
}
);

swapButton.addEventListener(
"click",
function () {
const oldFrom = fromLanguage.value;

fromLanguage.value =
  toLanguage.value;

toLanguage.value = oldFrom;

updateLabels();
clearError();

}
);

fromLanguage.addEventListener(
"change",
updateLabels
);

toLanguage.addEventListener(
"change",
updateLabels
);

copyButton.addEventListener(
"click",
async function () {
if (!currentTranslation) {
return;
}

try {
  await navigator.clipboard.writeText(
    currentTranslation
  );

  copyButton.textContent = "✓";

  setTimeout(function () {
    copyButton.textContent = "📋";
  }, 1000);

} catch {
  error("Could not copy translation.");
}

}
);

updateCount();
updateLabels();