let input = [];
let isAnswerCancelable = false;

const calculatorContainer = document.querySelector(".calculator-container");

const display = calculatorContainer.querySelector(".display");
const previousInput = display.querySelector(".previous-input");
const currentInput = display.querySelector(".current-input");

const buttons = calculatorContainer.querySelector(".buttons");
const buttonList = buttons.querySelectorAll("button");

function add(a, b) {return a + b;}

function subtract(a, b) {return a - b;}

function multiply(a, b) {return a * b;}

function divide(a, b) {return a / b;}

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
    clearInput();
    isAnswerCancelable = false;

    updatePreviousInput("");
    updateCurrentInput();
}

function clear() {
    if (isAnswerCancelable) {
        updatePreviousInput(`${getPreviousInput()} = ${getCurrentNumber()}`);
        isAnswerCancelable = false;
    }

    if (getCurrentNumber().length <= 1 || getLastInput("Infinity")) {
        if (input.length === 0) return;

        input.pop();
    } else {
        setCurrentNumber(getCurrentNumber().slice(0, -1));
    } 

    updateCurrentInput();
}

function updateCurrentInput() {
    currentInput.textContent = input.join(" ");
}

function getCurrentInput() {return currentInput.textContent;}

function updatePreviousInput(content) {previousInput.textContent = content;}

function getPreviousInput() {return previousInput.textContent;}

function getCurrentNumber() { 
    const lastElement = getLastInput();

    if (isNumber(lastElement)) return lastElement;
    else return "";
}   

function setCurrentNumber(str = "") {
    const lastElement = getLastInput();
    
    if (str === "") {
        if (isNumber(lastElement)) {
            input.pop();
        } 
        return;
    } 

    if (isNumber(lastElement)) {
        setLastInput(str);
    } else {
        input.push(str);
    }
}

function getLastInput() {
    if (input.length === 0) return "";
    return input[input.length - 1];
}

function setLastInput(str) {
    if (input.length === 0) input.push(str);
    else input[input.length - 1] = str;
}

function clearInput() {
    input.length = 0;
}

function getFirstPEMDASSLice(arr) {

    const firstParenthesisIndex = arr.indexOf("(");
    const lastParenthesisIndex = arr.lastIndexOf(")");

    if (firstParenthesisIndex !== -1) {
        const parenthesisSlice = arr.slice(firstParenthesisIndex, lastParenthesisIndex + 1);
        return [parenthesisSlice, firstParenthesisIndex];
    }

    const multiIndex = arr.indexOf("x");
    const divIndex = arr.indexOf("/");

    if (multiIndex !== -1 || divIndex !== -1) {
        const multiSlice = arr.slice(multiIndex - 1, multiIndex + 2);
        const divSlice = arr.slice(divIndex - 1, divIndex + 2);

        if (divIndex === -1) return [multiSlice, multiIndex - 1];
        if (multiIndex === -1) return [divSlice, divIndex - 1];

        return multiIndex > divIndex ? [divSlice, divIndex - 1] : [multiSlice, multiIndex - 1];
    }

    const addIndex = arr.indexOf("+");
    const subIndex = arr.indexOf("-");

    const addSlice = arr.slice(addIndex - 1, addIndex + 2);
    const subSlice = arr.slice(subIndex - 1, subIndex + 2);

    if (addIndex === -1) return [subSlice, subIndex - 1];
    if (subIndex === -1) return [addSlice, addIndex - 1];

    return subIndex > addIndex ? [addSlice, addIndex - 1] : [subSlice, subIndex - 1];
}

function solveEquation(equationArr) {

    while (equationArr.length !== 1) {
        console.log(equationArr);
        if (equationArr.length === 3) {
            return [operate(+equationArr[0], equationArr[1], +equationArr[2]).toString()];
        }

        const [PEMDASSlice, PEMDASStartIndex] = getFirstPEMDASSLice(equationArr);

        if (PEMDASSlice.includes("(")) {
            equationArr.splice(PEMDASStartIndex, PEMDASSlice.length, solveEquation(PEMDASSlice.slice(1, -1)));
            
            equationArr.forEach((element, index) => {
                if (index === equationArr.length - 1) return;

                if (isNumber(element) && isNumber(equationArr[index + 1])) {
                    equationArr.splice(index + 1, 0, "x");
                }
            });

        } else {
            equationArr.splice(PEMDASStartIndex, PEMDASSlice.length, ...solveEquation(PEMDASSlice));
        }
    }

    return equationArr;
}

function calculate() {
    if (getCurrentNumber().length === 0 && getLastInput() !== ")") return;
    if (getCurrentInput().slice(-1) === ".") return;
    if (!areParenthesisEqual()) return;

    
    const [answer] = solveEquation(input);

    const formattedAnswer = ((+answer).toFixed(4) * 1).toString();
    
    clearInput()
    setCurrentNumber(formattedAnswer);

    isAnswerCancelable = true;

    updatePreviousInput(getCurrentInput());
    updateCurrentInput();

}

function isNumber(num) {
    return !isNaN(num);
}

function areParenthesisEqual() {
    const obj = input.reduce((obj, element) => {
        if (!obj[element]) {
            obj[element] = 0;
        }

        obj[element]++;

        return obj;
    }, {})

    return obj["("] === obj[")"];

}

buttonList.forEach(button => {
    button.addEventListener("click", e => {
        const buttonContent = button.textContent; 

        if (isNumber(buttonContent) || buttonContent === ".") {
            if (buttonContent === "." && (
                getCurrentNumber().length === 0 || 
                isAnswerCancelable || 
                getCurrentNumber().includes(".")
            )) return;

            if (isAnswerCancelable) {
                updatePreviousInput(`${getPreviousInput()} = ${getCurrentNumber()}`);
                updateCurrentInput();

                setCurrentNumber();
                isAnswerCancelable = false;
            }    

            setCurrentNumber(getCurrentNumber() + buttonContent);
            updateCurrentInput();
        
        } else if (buttonContent === "=") {
            calculate();

        } else if (buttonContent === "C") {
            if (input.length === 0) {
                allClear();
            } else {
                clear();
            }

        } else if (buttonContent === "+/-") {
            if (getCurrentNumber().length === 0 && getLastInput() !== ")") return;            
            if (getCurrentInput().slice(-1) === ".") return;

            setCurrentNumber((+getCurrentNumber().slice(0) * -1).toString());
            updateCurrentInput();

        } else if (buttonContent === "(" || buttonContent === ")") {
            if (getCurrentInput().slice(-1) === ".") return;
            if (buttonContent === ")" && areParenthesisEqual()) return;

            input.push(buttonContent);
            
            updateCurrentInput();

        } else {
            if (getCurrentNumber().length === 0 && getLastInput() !== ")") return;
            if (getCurrentInput().slice(-1) === ".") return;

            if (isAnswerCancelable) {
                updatePreviousInput(`${getPreviousInput()} = ${getCurrentNumber()}`);
                isAnswerCancelable = false;
            }

            input.push(buttonContent);

            updateCurrentInput();
        }

        console.log(input);
    })
})