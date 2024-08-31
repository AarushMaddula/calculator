let input = [];
let currentNumber = "";

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

    updateCurrentInput("");
}

function clear() {
    currentNumber = "";
    updateCurrentInput(getCurrentInput().slice(0, -1));
    input.pop();   
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

buttonList.forEach(button => {
    button.addEventListener("click", e => {
        const buttonContent = button.textContent; 

        if (input.length === 0 && getCurrentInput().length !== 0 && currentNumber.length === 0) {
            updatePreviousInput(`${getPreviousInput()} = ${getCurrentInput()}`);
            updateCurrentInput("");
        }

        if (!isNaN(buttonContent)) {
            currentNumber += buttonContent;
            updateCurrentInput(getCurrentInput() + buttonContent);
        
        } else if (buttonContent === "=") {
            if (currentNumber === "") return;

            input.push(currentNumber);
            currentNumber = "";

            let currentOperator = "";

            let output = input.reduce((result, element, index) => {
                if (index === 0) return result; 

                if (!isNaN(element)) {
                    let num = operate(result, currentOperator, +element)

                    currentOperator = "";
                    return num;
                }

                currentOperator = element;
                return result;

            }, +input[0]);

            input.length = 0;
            updatePreviousInput(getCurrentInput());
            updateCurrentInput(output);

        } else {
            input.push(currentNumber);
            input.push(buttonContent);
            currentNumber = ""

            updateCurrentInput(`${getCurrentInput()} ${buttonContent} `);
        }
    })
})