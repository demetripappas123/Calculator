function add(a,b){
    a = parseFloat(a);
    b = parseFloat(b);
    return a + b;
}

function subtract(a,b){
    a = parseFloat(a);
    b = parseFloat(b);
    return a - b;
}

function multiply(a,b){
    a = parseFloat(a);
    b = parseFloat(b);
    return a*b;
}

function divide(a,b){
    a = parseFloat(a);
    b = parseFloat(b);
    return a/b;
}

let firstOperand;
let operator;
let secondOperand; 

function operate(firstOperand, operator, secondOperand){
    const operators = {
        "+" : add,
        "-" : subtract,
        "x" : multiply,
        "/" : divide,
    }
    return operators[operator](firstOperand, secondOperand);
}

//clear function and event listener 

const clearButton = document.querySelector("#clear");
clearButton.addEventListener("click",()=>{
    clear();
});

function clear(){
    displayVal = "0";
    display.textContent = displayVal;
    trackingArr.splice(0,trackingArr.length);
    fontSize();
}

//logic for inputting the numbers 
let displayVal = "0";
const display = document.querySelector(".display");
display.textContent = displayVal;

let trackingArr = [];

const numberButtons = document.querySelectorAll(".numbers");

//this is to put in a single number, displayVal
numberButtons.forEach((button)=>{
    button.addEventListener("click", ()=>{

        console.log("number button clicked");

        if(button.textContent == "."){
            let decimalCount = checkDecimal(displayVal,".");
            console.log(decimalCount);
            if(decimalCount > 0){
                return;
            }
        }

        if(displayVal.length >= 20){
            return;
        }
        if(displayVal != "0" && displayVal != "-0"){
            displayVal += button.textContent;
            display.textContent = displayVal;
            fontSize();

        }
        else{
            if(button.textContent != "0"){
                if(displayVal.charAt(0)=="-"){
                    displayVal = "-"; // would -0 work?
                    displayVal += button.textContent;
                    display.textContent = displayVal;
                    fontSize();
                }
                else if(displayVal.charAt(0) != "-"){
                    displayVal = "";
                    displayVal += button.textContent;
                    display.textContent = displayVal;
                    fontSize();
                }
            }
        }
    });
});
//^^^^^^^^^result of the above is a live updated displayVal & synced display textContent 



//logic for the operators & equals 
const operatorButtons = document.querySelectorAll(".operator");

operatorButtons.forEach((button)=>{
    button.addEventListener("click", ()=>{

        console.log("operator clicked");

        let theOperator = button.textContent;

        console.log(theOperator);

        if(theOperator == "="){
            if(trackingArr.length == 0){
                display.textContent = "";
                setTimeout((value)=>{
                    display.textContent = value;
                },75,displayVal);

                trackingArr.push(displayVal);
                displayVal = "";
                return;
            }
            //two cases - one display is empty, two display is a number 
            if(trackingArr.length == 1){
                if(displayVal == ""){
                    let disValue = trackingArr[0];
                    display.textContent = "";
                    setTimeout((value)=>{
                        display.textContent = value;
                    },75,disValue);
                    console.log(trackingArr);
                    return;

                }
                else if(displayVal != ""){
                    display.textContent = "";
                    setTimeout((value)=>{
                        display.textContent = value;
                    },75,displayVal);
                    trackingArr.splice(0,1, displayVal);
                    displayVal = "";
                    console.log(trackingArr);
                    return;
                }
            }
            if(trackingArr.length == 2){
                if(displayVal == ""){
                    
                    temporaryDisplayVal = display.textContent;
                    display.textContent = "";

                    setTimeout((value)=>{                        
                        display.textContent = value;
                    },75,temporaryDisplayVal);

                    trackingArr.splice(1); //formerly killed whole array 

                    return;
                }

                displayVal = operate(trackingArr[0],trackingArr[1],displayVal); //this is where displayVal gets updated 

                display.textContent = "";

                setTimeout(overFlow,75,displayVal);
                
                trackingArr.splice(0,trackingArr.length);
                trackingArr.push(displayVal);
                displayVal = "";
                return;
            }
            
        } 
        if(displayVal == "" && trackingArr.length == 1){
            displayVal = trackingArr[0];
            trackingArr.splice(0,1);
        }

        if(displayVal != "" && trackingArr.length == 1){
            trackingArr.splice(0,1);
        }

        if(displayVal == "" && trackingArr.length == 2){ //previously just the first condiiton, bugged 
            trackingArr[trackingArr.length-1] = theOperator;
            return;
        }

        trackingArr.push(displayVal);
        trackingArr.push(theOperator);

        if(trackingArr.length == 2){
            displayVal = "";
            console.log("cleared the displayVal");
        }
        if(trackingArr.length == 4){
            displayVal = operate(trackingArr[0], trackingArr[1],trackingArr[2]); 
            setTimeout(overFlow,75,displayVal);
            trackingArr[0] = displayVal;
            trackingArr[1] = theOperator;
            trackingArr.splice(2,2);
            displayVal = "";        
        }  
    });
});


const percent = document.querySelector("#percent");

percent.addEventListener("click",()=>{
    displayVal = displayVal/100;
    display.textContent = displayVal; //i wonder if this messes with the logic somehow...
});


const sign = document.querySelector("#sign");

sign.addEventListener("click",()=>{
    if(displayVal.charAt(0) == "-"){
        displayVal = displayVal.slice(1);
    }
    else if(displayVal.charAt(0)!="-"){
        displayVal = "-" + displayVal;
    }
    display.textContent = displayVal;
});



function fontSize(){
    console.log("font size is running");
    let length = display.textContent.length;

    if(length <= 6){
        display.style.fontSize = "3em";
    }
    else if(length <= 10){
        display.style.fontSize = "2em";
    }
    else if(length <= 20){
        display.style.fontSize = "1em";
    }
}

function overFlow(displayText){
    
    displayText = parseFloat(displayText);
    //OUT OF BOUNDS - always rounded to 1 
    if(Math.abs(displayText) > 1e20 || Math.abs(displayText) < 1e-6){
        displayText = displayText.toExponential(1);
        display.textContent = displayText;
        fontSize();
        return;
    }

    displayText = String(displayText);
    let strArr = displayText.split(".");
    
    let str = strArr[0];
    let str2 = strArr[1]; 

    console.log(displayText);
    console.log(displayVal);
    console.log(strArr);

    //IN BOUNDS: 
    //ONE: no decimals yes int case, where we already know it fits 
    if(strArr.length == 1){

        console.log("were in first in bounds case");

        display.textContent = displayText;
        fontSize();
        return;
    }
    //TWO: yes decimals no int case - wait we already know it fits - wait we dont 
    if(str == "" && str2.length != 0){

        console.log("were in second in bounds case");

        if(displayText.length > 20){
            displayText = round(displayText,19);
            display.textContent = displayText;
            fontSize();
            return;
        }
        else if(displayText.length <= 20){
            display.textContent = displayText;
            fontSize();
            return;
        }

    }
    //THREE: both decimals and an int case, need to determine how it will fit 
    if(str.length != 0 && str2.length != 0){
        if(str.length == 20){

            console.log("result is max int length");
            console.log(displayText);
            console.log(displayVal);

            displayText = Math.round(parseFloat(displayText));

            console.log(displayText);

            display.textContent = displayText;
            fontSize();
        }
        else if(str.length == 19){

            console.log("result is 19 int length");
            console.log(displayText);
            console.log(displayVal);

            displayText = Math.round(parseFloat(displayText));

            console.log(displayText);

            display.textContent = displayText + ".";
            fontSize();
        }
        else if(str.length < 19){

            console.log("we're in the right logic block");
            console.log(displayVal);
            console.log(displayText);

            let maxDecs = str2.length;
            let num = str.length;
            let idealRoundPlace = 19-num;

            console.log(num);
            console.log(maxDecs);
            console.log(idealRoundPlace);

            if(idealRoundPlace <= maxDecs){

                console.log("calculated answer's precision exceeds available space");

                displayText = round(displayText,idealRoundPlace);
            }
        
            display.textContent = displayText;
            fontSize();
        }
    }    
}

function checkDecimal(str, char){
    return str.split(char).length - 1;
}

function round(number, decimalPlace){
    if(decimalPlace < 0){
        return;
    }
    let factor = Math.pow(10, decimalPlace)
    return Math.round(number*factor) / factor;
}