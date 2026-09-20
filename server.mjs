import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
loadModel,
translate,
BERGAMOT_EN_ES,
BERGAMOT_ES_EN,
BERGAMOT_EN_FR,
BERGAMOT_FR_EN,
BERGAMOT_EN_DE,
BERGAMOT_DE_EN,
BERGAMOT_EN_IT,
BERGAMOT_IT_EN,
BERGAMOT_EN_PT,
BERGAMOT_PT_EN,
BERGAMOT_EN_NL,
BERGAMOT_NL_EN,
BERGAMOT_EN_PL,
BERGAMOT_PL_EN,
BERGAMOT_EN_RU,
BERGAMOT_RU_EN,
BERGAMOT_EN_UK,
BERGAMOT_UK_EN
} from "@qvac/sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const models = {
"en-es": [BERGAMOT_EN_ES, "en", "es"],
"es-en": [BERGAMOT_ES_EN, "es", "en"],

"en-fr": [BERGAMOT_EN_FR, "en", "fr"],
"fr-en": [BERGAMOT_FR_EN, "fr", "en"],

"en-de": [BERGAMOT_EN_DE, "en", "de"],
"de-en": [BERGAMOT_DE_EN, "de", "en"],

"en-it": [BERGAMOT_EN_IT, "en", "it"],
"it-en": [BERGAMOT_IT_EN, "it", "en"],

"en-pt": [BERGAMOT_EN_PT, "en", "pt"],
"pt-en": [BERGAMOT_PT_EN, "pt", "en"],

"en-nl": [BERGAMOT_EN_NL, "en", "nl"],
"nl-en": [BERGAMOT_NL_EN, "nl", "en"],

"en-pl": [BERGAMOT_EN_PL, "en", "pl"],
"pl-en": [BERGAMOT_PL_EN, "pl", "en"],

"en-ru": [BERGAMOT_EN_RU, "en", "ru"],
"ru-en": [BERGAMOT_RU_EN, "ru", "en"],

"en-uk": [BERGAMOT_EN_UK, "en", "uk"],
"uk-en": [BERGAMOT_UK_EN, "uk", "en"]
};

const loadedModels = new Map();

async function getModel(pair) {
const config = models[pair];

if (!config) {
throw new Error("Unsupported language pair: " + pair);
}

if (loadedModels.has(pair)) {
return loadedModels.get(pair);
}

console.log("Loading QVAC model: " + pair);

const modelId = await loadModel({
modelSrc: config[0],
modelConfig: {
engine: "Bergamot",
from: config[1],
to: config[2]
}
});

loadedModels.set(pair, modelId);

console.log("QVAC model ready: " + pair);

return modelId;
}

async function translateDirect(pair, text) {
const modelId = await getModel(pair);

console.log("Translating locally: " + pair);

const result = translate({
modelId: modelId,
text: text,
modelType: "nmtcpp-translation",
stream: true
});

let output = "";

for await (const token of result.tokenStream) {
output += token;
}

return output.trim();
}

async function translateText(from, to, text) {
const directPair = from + "-" + to;

if (models[directPair]) {
return await translateDirect(directPair, text);
}

if (from === to) {
return text;
}

const firstPair = from + "-en";
const secondPair = "en-" + to;

if (models[firstPair] && models[secondPair]) {
console.log("");
console.log(
from.toUpperCase() +
" -> ENGLISH -> " +
to.toUpperCase()
);

const english = await translateDirect(
  firstPair,
  text
);

console.log("Intermediate English:");
console.log(english);
console.log("");

return await translateDirect(
  secondPair,
  english
);

}

throw new Error(
"QVAC cannot translate " +
from +
" -> " +
to +
" with the available models."
);
}

function sendJson(response, status, data) {
response.writeHead(status, {
"Content-Type": "application/json; charset=utf-8",
"Cache-Control": "no-store"
});

response.end(JSON.stringify(data));
}

function serveFile(response, fileName, contentType) {
const filePath = path.join(
__dirname,
"public",
fileName
);

if (!fs.existsSync(filePath)) {
response.writeHead(404);
response.end("Not found");
return;
}

response.writeHead(200, {
"Content-Type": contentType
});

response.end(fs.readFileSync(filePath));
}

const server = http.createServer(
async (request, response) => {

try {

  if (
    request.method === "GET" &&
    request.url === "/"
  ) {
    serveFile(
      response,
      "index.html",
      "text/html; charset=utf-8"
    );
    return;
  }

  if (
    request.method === "GET" &&
    request.url === "/app.js"
  ) {
    serveFile(
      response,
      "app.js",
      "text/javascript; charset=utf-8"
    );
    return;
  }

  if (
    request.method === "GET" &&
    request.url === "/styles.css"
  ) {
    serveFile(
      response,
      "styles.css",
      "text/css; charset=utf-8"
    );
    return;
  }

  if (
    request.method === "POST" &&
    request.url === "/api/translate"
  ) {

    let body = "";

    for await (const chunk of request) {
      body += chunk;

      if (body.length > 10000) {
        throw new Error("Input is too large.");
      }
    }

    let data;

    try {
      data = JSON.parse(body);
    } catch {
      sendJson(response, 400, {
        error: "Invalid request."
      });
      return;
    }

    const text = String(
      data.text || ""
    ).trim();

    const pair = String(
      data.pair || ""
    ).trim();

    if (!text) {
      sendJson(response, 400, {
        error: "Please enter a word or phrase."
      });
      return;
    }

    const parts = pair.split("-");

    if (
      parts.length !== 2 ||
      !parts[0] ||
      !parts[1]
    ) {
      sendJson(response, 400, {
        error: "Invalid language pair: " + pair
      });
      return;
    }

    const from = parts[0];
    const to = parts[1];

    if (from === to) {
      sendJson(response, 400, {
        error: "Choose two different languages."
      });
      return;
    }

    console.log("");
    console.log("----------------------------------------");
    console.log("Translation request");
    console.log("From: " + from);
    console.log("To:   " + to);
    console.log("Text: " + text);
    console.log("----------------------------------------");

    const result = await translateText(
      from,
      to,
      text
    );

    sendJson(response, 200, {
      translation: result,
      local: true
    });

    return;
  }

  response.writeHead(404);
  response.end("Not found");

} catch (error) {

  console.error("");
  console.error("Translation error:");
  console.error(error);
  console.error("");

  sendJson(response, 500, {
    error:
      error.message ||
      "Translation failed."
  });
}

}
);

server.listen(PORT, () => {
console.log("");
console.log("========================================");
console.log(" BILINGUAL STUDY CARDS");
console.log(" QVAC LOCAL TRANSLATOR");
console.log("========================================");
console.log("");
console.log(
"Open Chrome at: http://localhost:" + PORT
);
console.log("");
console.log(
"Keep this Command Prompt running."
);
console.log("");
});