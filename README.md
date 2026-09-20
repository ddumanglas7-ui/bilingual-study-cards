# Bilingual Study Cards

A local AI language-learning translator powered by Tether's QVAC SDK.

Bilingual Study Cards turns words and phrases into translation study cards. Translation runs locally using QVAC models, so the text being translated does not need to be sent to a cloud AI service.

## Features

- English translation
- Spanish translation
- French translation
- German translation
- Italian translation
- Portuguese translation
- Dutch translation
- Polish translation
- Russian translation
- Ukrainian translation
- Local QVAC inference
- Browser-based interface
- Command-line translator
- Copy translations
- Save study cards locally
- No cloud AI API key required
- Translation through English when a direct language-pair model is unavailable

## QVAC SDK

This project uses Tether's QVAC SDK:

@qvac/sdk@0.19.1

The application calls:

loadModel()
translate()

The QVAC translation models perform inference locally through the application.

## How It Works

For language pairs with a direct QVAC model, the application translates directly.

Example:

English -> Spanish

For language pairs without a direct model, the application can translate through English when the required models are available.

Example:

Spanish -> English -> Italian

For example:

Spanish:

Buenos dias, como estas?

English:

Good morning, how are you?

Italian:

Buongiorno, come stai?

## Requirements

- Node.js
- npm
- A computer capable of running the QVAC SDK

## Installation

Clone the repository:

git clone YOUR_REPOSITORY_URL
cd bilingual-study-cards

Install the dependencies:

npm install

The project uses QVAC SDK version 0.19.1 or newer.

You can verify the installed version with:

npm list @qvac/sdk

## Run the Web App

Start the local server:

node server.mjs

Then open the application in your browser:

http://localhost:3000

Keep the terminal running while using the application.

## Command-Line Translator

The project also includes a command-line translator.

Run:

npm run translate

Follow the prompts to select the source language, target language, and enter a word or phrase.

Example:

Choose FROM language: Spanish
Choose TO language: Italian

Enter word or phrase:
Buenos dias, como estas?

The application can translate through English when necessary:

Spanish -> English -> Italian

Result:

Buongiorno, come stai?

## Study Cards

After a translation is generated, the web application displays it as a study card containing:

- Original phrase
- Source language
- Translation
- Target language

Cards can be saved locally in the browser for later study.

## Privacy

Translation is designed to run locally with QVAC.

The application does not use a cloud AI translation API to perform the translation.

Your translation text is processed by the local QVAC translation models through the application.

No external AI API key is required.

## Project Structure

bilingual-study-cards/
|
+-- public/
|   +-- index.html
|   +-- app.js
|   +-- styles.css
|
+-- server.mjs
+-- translate.mjs
+-- test-qvac.mjs
+-- study-deck.json
+-- package.json
+-- package-lock.json
+-- README.md
+-- LICENSE
+-- .gitignore

## Technologies

- JavaScript
- Node.js
- HTML
- CSS
- Tether QVAC SDK
- Bergamot translation models

## QVAC Integration

The core QVAC workflow is:

User enters text
       |
Select language pair
       |
loadModel()
       |
QVAC translation model
       |
translate()
       |
Translation result
       |
Study Card

For a language pair requiring an intermediate language:

User text
   |
Source language
   |
English
   |
Target language
   |
Final translation

## Example Use Case

A learner can enter:

Buenos dias, como estas?

and receive:

Buongiorno, come stai?

The translation can then be saved as a study card and reviewed later.

## Local AI

The purpose of this project is to demonstrate how an everyday application can use local AI instead of relying on a remote cloud AI service.

QVAC handles the local model loading and translation inference, while the application provides the language-learning interface around it.

## License

This project is licensed under the MIT License.

See the LICENSE file for the full license text.

## Built With QVAC

Built with Tether's QVAC SDK to demonstrate local AI-powered translation and language learning.

QVAC:
https://qvac.tether.io/

---

Bilingual Study Cards - local translation, simple study cards, and AI running on your device.

## Development

The project is intended as a simple demonstration of local AI translation using QVAC. The web interface and command-line translator use the same local translation approach.

## Project Status

Bilingual Study Cards is a working local AI translation project built for the QVAC SDK challenge.