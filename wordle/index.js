const API_SECRET_WORD_URL = 'https://words.dev-apis.com/word-of-the-day';
const API_WORD_VALID_URL = '';
const LETTER_VALIDATION = new RegExp('/^[A-Z]+$/');

async function getSecretWord() {
    const response = await fetch(API_SECRET_WORD_URL);
    const data = await response.json();
    console.log('data', data);
}

async function checkWordIsValid(params) {
    const response = await fetch(API_SECRET_WORD_URL);
    const data = await response.json();
}

function init() {
    getSecretWord();
}

// init();
