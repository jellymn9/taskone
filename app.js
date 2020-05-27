
//let numberInputFirst = ""; //ovaj element predstavlja prvi unjeti broj
//let numberInputSecond = ""; //ovaj element predstavlja drugi unjeti broj
//let resultArray = []; //ovaj niz ce da popunjavaju redom numberInputFirst, operacija, umberInputSecond
//const resultElement = document.getElementById("enteredVal"); // ovo je div je kao "ekran" na digitronu
//const numberElements = document.getElementsByClassName("numEls"); // niz dugmica koji su brojevi
//const operationElements = document.getElementsByClassName("o_class"); // dugmici koji predstavljaju operacije
//const equalOperationElement = document.getElementById("sumId"); // ovo je dugme "="
//const clearBtnElement = document.getElementById("clearBtn"); // dugme "C"
//const pointBtnElement = document.getElementById("pointId");  // dugme "."
//let pointInnerTxt = pointBtnElement.innerText; // innerTxt za dugme "."
let globalVariablesObject = {
   numberInputFirst: "",
   numberInputSecond: "",
   resultArray: [],
   resultElement: document.getElementById("enteredValue"),
   numberElements: document.getElementsByClassName("numberBtnClass"),
   operationElements: document.getElementsByClassName("operationClass"),
   equalOperationElement: document.getElementById("sumId"),
   clearBtnElement: document.getElementById("clearBtnId"),
   pointBtnElement: document.getElementById("pointId"),
   historyArray: []
}

// this function makes that first number goes to [0] position for resultArray as numberInputFirst
// also to update its value as well as numberInputSecond
// it leaves [1] array position empty and reserved for operation later in code 
function testFirst(a){
   if( globalVariablesObject.resultArray.length <= 1 ){
      globalVariablesObject.numberInputFirst += a;
      globalVariablesObject.resultArray[0]= globalVariablesObject.numberInputFirst;
      globalVariablesObject.resultElement.innerText = globalVariablesObject.resultArray[0];
      console.log("testFirst runs", globalVariablesObject.resultArray, globalVariablesObject.numberInputFirst);
   }else if(globalVariablesObject.resultArray.length == 2 || globalVariablesObject.resultArray.length == 3 ){
      globalVariablesObject.numberInputSecond += a;
      globalVariablesObject.resultArray[2] = globalVariablesObject.numberInputSecond;
      globalVariablesObject.resultElement.innerText = globalVariablesObject.resultArray.join(""); 
      console.log("resAray:",globalVariablesObject.resultArray, "numberInputSecond:", globalVariablesObject.numberInputSecond);
   }
   
   updateLocalStorage();
}

globalVariablesObject.pointBtnElement.addEventListener('click',testSecond);

//this function stops "." from being entered as fist character in number as .123
//but it does not prevent this from happening 123.+ 
function testSecond(e){
   if(globalVariablesObject.resultArray.length == 1 & !globalVariablesObject.numberInputFirst.includes(globalVariablesObject.pointBtnElement.innerText)){
      testFirst(globalVariablesObject.pointBtnElement.innerText);
   }else if( globalVariablesObject.resultArray.length == 3 & !globalVariablesObject.numberInputSecond.includes(globalVariablesObject.pointBtnElement.innerText)){
      testFirst(globalVariablesObject.pointBtnElement.innerText);
   }
}
 
//this function stops operation to be entered after number ends with "."
function testThird(j,d){
   if( (globalVariablesObject.resultArray.length==1 & globalVariablesObject.numberInputFirst[(globalVariablesObject.numberInputFirst.length-1)]!=globalVariablesObject.pointBtnElement.innerText) || (globalVariablesObject.resultArray.length==3 & globalVariablesObject.numberInputSecond[(globalVariablesObject.numberInputSecond.length-1)]!=globalVariablesObject.pointBtnElement.innerText) ){
      d();
   }
}

//with for loop I include all number buttons so I can add the same function on click event
for(let i=0; i< globalVariablesObject.numberElements.length; i++){
   globalVariablesObject.numberElements[i].addEventListener('click', clickFunction);
   function clickFunction(e){
      let t = globalVariablesObject.numberElements[i].innerText; //innerTxt za brojeve dugmice
      testFirst(t);  
      }
};

//same for previous but for operations buttons | condition from function testThird is being tested and if it is true operationFunction runs
//operationFunction provides that operation goes to resultArray[1] and it stops entering more operations in a row (for instance ++)
//when we have all 3 positions in resultArray (for instance [1,+,2]) operation that comes after calls runOperation function
//so result is placed at first place in array resultArray[0] and operation goes at second position resultArray[1]
for(let i=0; i< globalVariablesObject.operationElements.length; i++){
   globalVariablesObject.operationElements[i].addEventListener('click', function(e) { return testThird(e, operationFunction) });
   function operationFunction(){
      if(globalVariablesObject.resultArray.length != 0 & globalVariablesObject.resultArray.length != 2 & globalVariablesObject.resultArray.length != 3){
            let operationTxt = globalVariablesObject.operationElements[i].innerText;
            switch(operationTxt){
               case "+":
                  globalVariablesObject.resultArray.push(operationTxt);
                  globalVariablesObject.resultElement.innerText = globalVariablesObject.resultArray.join("");
                  console.log("+button pressed", globalVariablesObject.resultArray);
                  break;
               case "-":
                  globalVariablesObject.resultArray.push(operationTxt);
                  globalVariablesObject.resultElement.innerText += operationTxt;
                  break;
               case "x":
                  globalVariablesObject.resultArray.push("*");
                  globalVariablesObject.resultElement.innerText += "*";
                  console.log("x button pressed", globalVariablesObject.resultArray);
                  break;
               case "/":
                  globalVariablesObject.resultArray.push(operationTxt);
                  globalVariablesObject.resultElement.innerText += operationTxt;
                  break;
            }
            updateLocalStorage();
         }
      else if(globalVariablesObject.resultArray.length == 3){
            runOperation();
            operationFunction();
            console.log("runO from op");
      }
   }
}

globalVariablesObject.equalOperationElement.addEventListener('click', function(e){return testThird(e,runOperation)});

//this function gives result when "=" btn is clicked or when some operation is clicked and there is already 3 elements in resultArray=[1,+,3]
function runOperation(){
   let resultArrayString = eval(globalVariablesObject.resultArray.join("")).toString();
   updateHistory(resultArrayString);
   //console.log("resAString", resultArrayString, "resA", globalVariablesObject.resultArray);
   globalVariablesObject.resultElement.innerText = resultArrayString;
   globalVariablesObject.resultArray = [];
   globalVariablesObject.numberInputSecond = "";
   globalVariablesObject.numberInputFirst = resultArrayString;
   globalVariablesObject.resultArray.push(globalVariablesObject.numberInputFirst);
   //console.log(typeof(resultArrayString));
   console.log("resultArray:",globalVariablesObject.resultArray, "numberInputFirst:",globalVariablesObject.numberInputFirst, "numberInputSecond:",globalVariablesObject.numberInputSecond);
   updateLocalStorage();
}

// eventHandler za "C" dugme sve setuje na pocetne vrijednosti
globalVariablesObject.clearBtnElement.onclick = function(){
   globalVariablesObject.resultArray = [];
   globalVariablesObject.numberInputFirst = "";
   globalVariablesObject.numberInputSecond = "";
   globalVariablesObject.resultElement.innerText = globalVariablesObject.resultArray;
   updateLocalStorage(); 
}

//this function updates 'currentInput' and 'resultArray' to new values of 'resultElement' and 'resultArray' and
//it is called from functions where these values are changed
function updateLocalStorage(){
   window.localStorage.setItem('currentInput', globalVariablesObject.resultElement.innerText);
   window.localStorage.setItem('resultArray',JSON.stringify(globalVariablesObject.resultArray));
}

//this function adds calculations as history in localStorage | it's called from runOperation function |
//history value is array and every array element has this form (example) "1+2=3" 
function updateHistory(a){
   let b = globalVariablesObject.resultArray.join("") + "=" + a;
   globalVariablesObject.historyArray.push(b);
   window.localStorage.setItem('history', JSON.stringify(globalVariablesObject.historyArray));
}

// this function sets input field value to one we entered before closing page or reloading it
window.onload = function(){
   
   if(window.localStorage.getItem('resultArray') != null)
   globalVariablesObject.resultArray = JSON.parse(window.localStorage.getItem('resultArray'));
   globalVariablesObject.resultElement.innerText = window.localStorage.getItem('currentInput');
};
