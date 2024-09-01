let input = [];
let currentNumber = "";
let isAnswerCancelable = false;

const calculatorContainer = document.querySelector(".calculator-container");

const display = calculatorContainer.querySelector(".display");
const previousInput = display.querySelector(".previous-input");
const currentInput = display.querySelector(".current-input");

const buttons = calculatorContainer.querySelector(".buttons");
const buttonList = buttons.querySelectorAll("button");

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, op, b) {
    switch (op) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "x":
            return multiply(a, b);
        case "/":
            return divide(a, b);
    }
}

function allClear() {
    input.length = 0;
    currentNumber = "";
    isAnswerCancelable = false;

    updatePreviousInput("");
    updateCurrentInput("");
}

function clear() {
    if (isAnswerCancelable) {
        updatePreviousInput(`${getPreviousInput()} = ${currentNumber}`);
        isAnswerCancelable = false;
    }

    if (currentNumber.length === 0) {
        if (input.length === 0) return;

        const lastElement = input[input.length - 1];

        if (lastElement.length === 1) input.pop();
        else input[input.length - 1] = lastElement.slice(0, -1);

    } else {
        currentNumber = currentNumber.slice(0, -1);
    } 

    updateCurrentInput(getCurrentInput().slice(0, -1).trimEnd());
}

function updateCurrentInput(content) {
    currentInput.textContent = content;
}

function getCurrentInput() {
    return currentInput.textContent;
}

function updatePreviousInput(content) {
    previousInput.textContent = content;
}

function getPreviousInput() {
    return previousInput.textContent;
}

function getFirstPEMDASIndex() {
    const multiIndex = input.indexOf("x");
    const divIndex = input.indexOf("/");


    if (multiIndex !== -1 || divIndex !== -1) {
        if (divIndex === -1) return multiIndex;
        if (multiIndex === -1) return divIndex;

        return multiIndex > divIndex ? divIndex : multiIndex;
    }

    const addIndex = input.indexOf("+");
    const subIndex = input.indexOf("-");

    if (addIndex === -1) return subIndex;
    if (subIndex === -1) return addIndex;

    return subIndex > addIndex ? addIndex : subIndex;
}

function calculate() {
    if (currentNumber === "") return;
    input.push(currentNumber);

    let answer = input[0];

    while (input.length > 1) {
        const index = getFirstPEMDASIndex();

        answer = operate(+input[index - 1], input[index], +input[index + 1]);
        input = [...input.slice(0, index - 1), answer, ...input.slice(index + 2)];
    }
    
    currentNumber = answer.toString();
    isAnswerCancelable = true;

    updatePreviousInput(getCurrentInput());
    updateCurrentInput(answer);

    input.length = 0;
}

function isNumber(num) {
    return !isNaN(num);
}

buttonList.forEach(button => {
    button.addEventListener("click", e => {
        const buttonContent = button.textContent; 

        if (isNumber(buttonContent)) {
            if (isAnswerCancelable) {
                updatePreviousInput(`${getPreviousInput()} = ${currentNumber}`);
                updateCurrentInput("");

                currentNumber = "";
                isAnswerCancelable = false;
            }    

            currentNumber += buttonContent;

            updateCurrentInput(getCurrentInput() + buttonContent);
        
        } else if (buttonContent === "=") {
            calculate();

        } else if (buttonContent === "AC") {
            allClear();

        } else if (buttonContent === "C") {
            clear();

        } else {
            if (currentNumber.length === 0) return;

            if (isAnswerCancelable) {
                updatePreviousInput(`${getPreviousInput()} = ${currentNumber}`);
                isAnswerCancelable = false;
            }

            input.push(currentNumber, buttonContent);
            currentNumber = "";

            updateCurrentInput(`${getCurrentInput()} ${buttonContent} `);
        }

        console.log(`${input} ${currentNumber}`);
    })
})