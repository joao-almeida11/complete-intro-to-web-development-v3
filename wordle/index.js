const API_SECRET_WORD_URL = 'https://words.dev-apis.com/word-of-the-day';
const API_WORD_VALID_URL = 'https://words.dev-apis.com/validate-word';
const LETTER_VALIDATION = /^[a-zA-Z]$/;
const ANSWER_LENGTH = 5;

let secret;
let done = false;

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
        htmlCollectionOfInputs[i].addEventListener(
            'keydown',
            function handleKeyPress(event) {
                if (done) return;
                const action = event.key;
                // naming the function for easier debugging
                if (action === 'Backspace') {
                    event.preventDefault();

                    if (htmlCollectionOfInputs[i].value) {
                        // if its on the first character delete the first character
                        htmlCollectionOfInputs[i].value = '';
                    } else if (i > 0) {
                        // if its not delete the current selected character and focus on the previous character
                        htmlCollectionOfInputs[i - 1].value = '';
                        htmlCollectionOfInputs[i - 1].focus();
                    }
                }

                if (!isLetter(action) && action !== 'Enter') {
                    event.preventDefault();
                }
            }
        );

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
            const action = event.key;
            if (action === 'Enter') {
                // extract attempted word from inputs
                const attemptedWordInputs =
                    htmlCollectionOfLabels[i].getElementsByTagName('input');

                let attemptedWord = '';
                for (let y = 0; y < attemptedWordInputs.length; y++) {
                    attemptedWord =
                        attemptedWord + attemptedWordInputs[y].value;
                }

                if (attemptedWord.length !== ANSWER_LENGTH) return;
                if (attemptedWord === secret) {
                    // validate word
                    for (let y = 0; y < attemptedWordInputs.length; y++) {
                        attemptedWordInputs[y].classList.add('correct');
                    }
                    alert('you win');
                    document
                        .getElementsByTagName('h1')[0]
                        .classList.add('winner');
                    done = true;
                } else {
                    checkWordIsValid(attemptedWord).then(res => {
                        if (res.validWord) {
                            // row had wrong word

                            const secretWordArray = secret.split('');
                            const attemptedWordArray = attemptedWord.split('');
                            const results = [];
                            for (let a = 0; a < secretWordArray.length; a++) {
                                for (
                                    let k = 0;
                                    k < attemptedWordArray.length;
                                    k++
                                ) {
                                    // letter in correct order
                                    // keeping track of indexes
                                    if (
                                        attemptedWordArray[k] ===
                                        secretWordArray[a]
                                    ) {
                                        // if the letter was already matched before
                                        const IndexOfLetterAlreadyFound =
                                            results.findIndex(
                                                x =>
                                                    x.letter ===
                                                    attemptedWordArray[k]
                                            );

                                        console.log(
                                            'IndexOfLetterAlreadyFound',
                                            IndexOfLetterAlreadyFound
                                        );

                                        if (IndexOfLetterAlreadyFound !== -1) {
                                            results[
                                                IndexOfLetterAlreadyFound
                                            ].indexOfAttempts.push(k);
                                            results[
                                                IndexOfLetterAlreadyFound
                                            ].indexOfSecret.push(a);
                                            results[
                                                IndexOfLetterAlreadyFound
                                            ].count += 1;
                                        } else {
                                            // if the letter has no previous match index
                                            results.push({
                                                letter: attemptedWordArray[k],
                                                indexOfAttempts: [k],
                                                indexOfSecret: [a],
                                                count: 1,
                                            });
                                        }

                                        if (k === a) {
                                            attemptedWordInputs[
                                                a
                                            ].classList.add('correct');
                                        }
                                    }
                                }
                            }

                            console.log('results', results);

                            // letter in incorrect order
                            results.forEach(x => {
                                const secretLetterCount =
                                    x.indexOfSecret.length;
                                const attemptExistingLetterCount =
                                    x.indexOfAttempts.length;

                                // for the amount of times the secret has the same letter
                                // add the yellow color to the attempted word
                                for (
                                    let p = 0;
                                    p < secretLetterCount.length;
                                    p++
                                ) {
                                    if (p < attemptExistingLetterCount.length) {
                                        attemptedWordInputs[
                                            attemptExistingLetterCount[p]
                                        ].classList.add('close');
                                    }
                                }
                            });

                            for (
                                let a = 0;
                                a < attemptedWordInputs.length;
                                a++
                            ) {
                                if (
                                    attemptedWordInputs[a].classList.value == ''
                                ) {
                                    attemptedWordInputs[a].classList.add(
                                        'wrong'
                                    );
                                }
                            }

                            if (i === htmlCollectionOfLabels.length - 1) {
                                // there are no further attempts
                                alert('you lose, the word was ' + secret);
                                done = true;
                            } else {
                                // move to next attempt
                                htmlCollectionOfLabels[i + 1].focus();
                                console.log('wrong answer');
                            }
                        } else {
                            console.log(
                                'htmlCollectionOfLabels[i]',
                                htmlCollectionOfLabels[i]
                            );
                            htmlCollectionOfLabels[i].classList.add('invalid');
                            document.activeElement.blur(); // removes the current focus
                            // the answer was not a valid word
                            // clear the current label inputs
                            console.log('the answer was not a valid word');

                            setTimeout(() => {
                                for (
                                    let y = 0;
                                    y < attemptedWordInputs.length;
                                    y++
                                ) {
                                    attemptedWordInputs[y].value = '';
                                }

                                htmlCollectionOfLabels[i].classList.remove(
                                    'invalid'
                                );
                                attemptedWordInputs[0].focus();
                            }, 1000);
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

    getSecretWord()
        .then(() => {
            document
                .getElementsByClassName('info-bar')[0]
                .classList.add('hidden');
            setLabelListeners(labels);
        })
        .catch(err => console.error('failed to get secret word ->', err));

    for (let i = 0; i < labels.length; i++) {
        const inputs = labels[i].getElementsByTagName('input');
        setInputListeners(inputs);
    }
}

init();
