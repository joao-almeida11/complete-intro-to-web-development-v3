const monitor = document.querySelector('.monitor');
const indicator = document.querySelector('.indicator');
console.log('monitor', monitor.innerText);

// stores the numbers and operations to perform when sum is pressed
let historyNumbers = [];
let isSumDone = false;

function clear() {
    console.log('clear');
    monitor.innerText = 0;
    historyNumbers = [];
    indicator.innerText = '';
    isSumDone = false;
}

function backspace() {
    if (isSumDone) {
        clear();
        return;
    }

    if (monitor.innerText.length > 1) {
        monitor.innerText = monitor.innerText.slice(0, -1);
    } else monitor.innerText = 0;
}
function divide() {
    isSumDone = false;
    if (monitor.innerText === '0') return;
    historyNumbers.push({
        type: 'number',
        value: monitor.innerText,
    });
    historyNumbers.push({
        type: 'operator',
        value: 'divide',
    });
    monitor.innerText = 0;
    indicator.innerText = ''; // clean the indicator when starting a new number
}
function addNumberToMonitor(value) {
    const numberToAdd = value.substring(1);

    if (monitor.innerText.length === 1 && monitor.innerText === '0') {
        monitor.innerText = numberToAdd;
    } else monitor.innerText += numberToAdd;
}

function multiply() {
    isSumDone = false;
    if (monitor.innerText === '0') return;
    historyNumbers.push({
        type: 'number',
        value: monitor.innerText,
    });
    historyNumbers.push({
        type: 'operator',
        value: 'multiply',
    });
    monitor.innerText = 0;
    indicator.innerText = ''; // clean the indicator when starting a new number
}

function minus() {
    isSumDone = false;
    if (monitor.innerText === '0') {
        // replace the indicator (indicates if a number is positive or negative)
        if (
            historyNumbers.length !== 0 &&
            historyNumbers[historyNumbers.length - 1].type === 'indicator'
        ) {
            historyNumbers.pop();
        }
        // for negative numbers
        historyNumbers.push({
            type: 'indicator',
            value: 'minus',
        });
        indicator.innerText = '-';
        return;
    }
    historyNumbers.push({
        type: 'number',
        value: monitor.innerText,
    });
    historyNumbers.push({
        type: 'operator',
        value: 'minus',
    });
    monitor.innerText = 0;
    indicator.innerText = ''; // clean the indicator when starting a new number
}

function plus() {
    isSumDone = false;

    if (monitor.innerText === '0') {
        // replace the indicator (indicates if a number is positive or negative)
        if (
            historyNumbers.length !== 0 &&
            historyNumbers[historyNumbers.length - 1].type === 'indicator'
        ) {
            historyNumbers.pop();
        }
        // for positive numbers
        historyNumbers.push({
            type: 'indicator',
            value: 'plus',
        });
        indicator.innerText = '+';
        return;
    }
    historyNumbers.push({
        type: 'number',
        value: monitor.innerText,
    });
    historyNumbers.push({
        type: 'operator',
        value: 'plus',
    });
    monitor.innerText = 0;
    indicator.innerText = ''; // clean the indicator when starting a new number
}

function sum() {
    if (monitor.innerText === '0') return;
    if (historyNumbers.length < 2) return; // the current number in the monitor is still not in the historyNumbers

    historyNumbers.push({
        type: 'number',
        value: monitor.innerText,
    });

    let stringToEvaluate = '';
    for (let i = 0; i < historyNumbers.length; i++) {
        if (historyNumbers[i].type === 'number') {
            stringToEvaluate += ' ' + historyNumbers[i].value;
        } else if (historyNumbers[i].type === 'operator') {
            switch (historyNumbers[i].value) {
                case 'plus':
                    stringToEvaluate += ' +';
                    break;
                case 'minus':
                    stringToEvaluate += ' -';
                    break;
                case 'multiply':
                    stringToEvaluate += ' *';
                    break;
                case 'divide':
                    stringToEvaluate += ' /';
                    break;
                default:
                    console.error('unknown operator method');
                    break;
            }
        } else if (historyNumbers[i].type === 'indicator') {
            // if there is an indicator in the last position ignore it
            if (i === historyNumbers.length - 1) break;

            if (historyNumbers[i + 1].type !== 'number') {
                console.error('Error: indicator was not followed by a number');
                break;
            }

            if (historyNumbers[i].value === 'minus') {
                stringToEvaluate += ' (-' + historyNumbers[i + 1].value + ')';
            } else {
                stringToEvaluate += ' ' + historyNumbers[i + 1].value;
            }
            // in order to wrap the number in () if the indicator is negative we use the next index of the history
            i++;
        }
    }
    console.log('stringToEvaluate', stringToEvaluate);

    const result = eval(stringToEvaluate);

    monitor.innerText = result;
    indicator.innerText = '';
    historyNumbers = [];
    isSumDone = true;
}

function init() {
    document
        .querySelector('.btns-grid')
        .addEventListener('click', function (e) {
            // e.stopPropagation();
            e.preventDefault();

            console.log('formOnClick', e.target);
            if (e.target.tagName === 'BUTTON') {
                console.log('e.target.classList', e.target.classList);
                switch (e.target.classList[0]) {
                    case 'clear':
                        clear();
                        break;
                    case 'backspace':
                        backspace();
                        break;
                    case 'divide':
                        divide();
                        break;
                    case 'n0':
                    case 'n1':
                    case 'n2':
                    case 'n3':
                    case 'n4':
                    case 'n5':
                    case 'n6':
                    case 'n7':
                    case 'n8':
                    case 'n9':
                        if (isSumDone) return;

                        addNumberToMonitor(e.target.classList[0]);
                        break;
                    case 'multiply':
                        multiply();
                        break;
                    case 'minus':
                        minus();
                        break;
                    case 'plus':
                        plus();
                        break;
                    case 'sum':
                        sum();
                        break;
                    default:
                        console.error('btn method not defined');
                        break;
                }
            }

            console.log('historyNumbers', historyNumbers);
        });
}

init();
