

const button = document.getElementById("submitButton");
button.addEventListener("click", function() {
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const message = document.getElementById("userMessage").value;
});

document.addEventListener("mousemove", (event)=> {
    const x = event.pageX;
    const y = event.pageY;
    document.querySelector("body").style.backgroundColor = `rgb(${x}, ${y}, ${(x*y)/100  })`;
});

document.addEventListener("keydown", (event)=> {
    const key = event.key;
    console.log(key);
    document.querySelector("body").style.backgroundColor = `rgb(${key.charCodeAt(0)}, ${key.charCodeAt(0)}, ${(key.charCodeAt(0)*key.charCodeAt(0))/100  })`;
});

let calculatorDisplay = "0";
let newNumber = true;
const calculatorButtons = document.getElementsByClassName("calculator-button");
for (let i = 0; i < calculatorButtons.length; i++) {
    calculatorButtons[i].addEventListener("click", (event)=> {
        const buttonValue = event.target.value;
        console.log(buttonValue);
        if (buttonValue === "=") {
            try {
                calculatorDisplay = eval(calculatorDisplay);
            } catch (error) {
                calculatorDisplay = "Error";
            }
            updateDisplay(calculatorDisplay)
            calculatorDisplay = "0";

        } else if (buttonValue === "C") {
            calculatorDisplay = "0";
            newNumber = true;
            updateDisplay(calculatorDisplay)
            
        } else {
            if (newNumber && calculatorDisplay[calculatorDisplay.length-1]=="0") {
                calculatorDisplay = calculatorDisplay.slice(0, calculatorButtons.length - 1);
                calculatorDisplay = buttonValue;
                newNumber = false;
            } else{
                newNumber = true;
                calculatorDisplay += buttonValue;
            
            }
            updateDisplay(calculatorDisplay)
        }
    });
}

function updateDisplay(value) {
    document.getElementsByClassName("calculator-display")[0].innerHTML = value;
}