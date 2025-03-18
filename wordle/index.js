const API_SECRET_WORD_URL = 'https://words.dev-apis.com/word-of-the-day';
const API_WORD_VALID_URL = 'https://words.dev-apis.com/validate-word';
const LETTER_VALIDATION = /^[a-zA-Z]$/;

let secret;

async function getSecretWord() {
    const response = await fetch(API_SECRET_WORD_URL);
    const data = await response.json();
    console.log('data', data);
    secret = data.word;
}

function isLetter(letter) {
    return LETTER_VALIDATION.test(letter);
}

async function checkWordIsValid(guessedWord) {
    const response = await fetch(API_WORD_VALID_URL, {
        method: 'POST',
        body: JSON.stringify({ word: guessedWord }),
    });
    const data = await response.json();
    return data;
}

function setInputListeners(htmlCollectionOfInputs) {
    for (let i = 0; i < htmlCollectionOfInputs.length; i++) {
        htmlCollectionOfInputs[i].addEventListener('keydown', function (event) {
            if (event.key === 'Backspace') {
                event.preventDefault();

                if (htmlCollectionOfInputs[i].value) {
                    htmlCollectionOfInputs[i].value = '';
                } else if (i > 0) {
                    htmlCollectionOfInputs[i - 1].value = '';
                    htmlCollectionOfInputs[i - 1].focus();
                }
            }

            if (!isLetter(event.key) && event.key !== 'Enter') {
                event.preventDefault();
            }
        });

        htmlCollectionOfInputs[i].addEventListener('input', function (event) {
            if (htmlCollectionOfInputs[i + 1]) {
                htmlCollectionOfInputs[i + 1].focus();
            }
        });
    }
}
function setLabelListeners(htmlCollectionOfLabels) {
    for (let i = 0; i < htmlCollectionOfLabels.length; i++) {
        htmlCollectionOfLabels[i].addEventListener('keydown', function (event) {
            event.stopPropagation();
            if (event.key === 'Enter') {
                // extract attempted word from inputs
                const attemptedWordInputs =
                    htmlCollectionOfLabels[i].getElementsByTagName('input');

                let attemptedWord = '';
                for (let y = 0; y < attemptedWordInputs.length; y++) {
                    attemptedWord =
                        attemptedWord + attemptedWordInputs[y].value;
                }

                // validate word
                if (attemptedWord === secret) {
                    console.log('game won');
                } else {
                    checkWordIsValid(attemptedWord).then(res => {
                        console.log('res', res);
                        if (res.validWord) {
                            // row had wrong word
                            if (
                                typeof htmlCollectionOfLabels[i + 1] !==
                                undefined
                            ) {
                                // move to next attempt
                                htmlCollectionOfLabels[i + 1].focus();
                                console.log('wrong answer');
                            }
                        } else {
                            // the answer was not a valid word
                            console.log('the answer was not a valid word');
                            for (
                                let y = 0;
                                y < attemptedWordInputs.length;
                                y++
                            ) {
                                attemptedWordInputs[y].value = '';
                            }
                        }
                    });
                }
            }
        });
    }
}

function init() {
    const labels = document
        .getElementById('tester-input')
        .getElementsByTagName('label');

    getSecretWord().then(() => {
        setLabelListeners(labels);
    });

    for (let i = 0; i < labels.length; i++) {
        const inputs = labels[i].getElementsByTagName('input');
        setInputListeners(inputs);
    }
}

init();
