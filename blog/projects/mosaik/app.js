let pazzlsArray = []
let colors = {"white":1, "green":3, "red": 4, "yellow":4, "blue":4}
let combinationWin1 = false
let combinationWin2 = false
let combinationWin3 = false
let stepValue = 0


function start(){
    for (let i = 0; i < COUNTS_PAZZLS_Y; i++){
        for (let j = 0; j < COUNTS_PAZZLS_X; j++){
            let randomColor = randomKey(colors)
            let pazzl = createPazzl(randomColor, i, j)
            // addToDOM(pazzl)
            pazzlsArray.push(pazzl)
            colors[randomColor] -=1     
            if (colors[randomColor] == 0){
                delete colors[randomColor]
            }
            addToDOM(pazzl, COUNTS_PAZZLS_Y*i+j).addEventListener("click", ()=>{
                let whitePazzl = checkWhiteNextPazzl(pazzl)
                // debugger
                if ( whitePazzl!= false){
                    switchPuzzls(whitePazzl, pazzl, i, j)
                    let arrayComb = checkCombinations()
                    // debugger  
                    if (arrayComb[0] == 4 && combinationWin1 == false){
                        combinationWin1 =true
                        stepValue = move(33+stepValue, stepValue)
                        console.log("blue row win!");
                        if (stepValue == 99){
                            console.log("You win");
                        }
                    }
                    if (arrayComb[1] == 4 && combinationWin2 == false){
                        combinationWin2 =true
                        stepValue = move(33+stepValue, stepValue)
                        console.log("yel row win!");
                        if (stepValue == 99){
                            console.log("You win");
                        }
                    }
                    if (arrayComb[2] == 4 && combinationWin3 == false){
                        combinationWin3 =true
                        stepValue = move(33+stepValue, stepValue)
                        console.log("red row win!");
                        if (stepValue == 99){
                            console.log("You win");
                        }
                    }
                    console.log(arrayComb[0]);
                }  
                // debugger
            })    
        }
    }
}
start(  )

MAP_ELEMENT.style.left = `${PADDING_MAP_LEFT}px`
MAP_ELEMENT.style.top = `${PADDING_MAP_TOP}px`
MAP_ELEMENT.style.width = `${COUNTS_PAZZLS_X*(PAZZL_WIDTH +EXTRA_PADDING)+EXTRA_PADDING}px`
MAP_ELEMENT.style.height = `${COUNTS_PAZZLS_Y*(PAZZL_HEIGHT+ EXTRA_PADDING)+EXTRA_PADDING}px`

function move(point, stepValue) {

    let elem = document.getElementById("bar");
    let id = setInterval(frame, 500);
  
    function frame() {
      if (stepValue >= point) {
        clearInterval(id);

      } else {
        elem.style.width = (stepValue + 11) + "%";
        stepValue=(stepValue + 11);
      }
      
    }
    return point
  }

function switchPuzzls(pazzl1, pazzl2, i, j){
    document.body.style.pointerEvents = "none"
    let pazzl1Index = pazzlsArray.indexOf(pazzl1)
    let pazzl2Index = pazzlsArray.indexOf(pazzl2)
 
    let b = pazzlsArray[pazzl2Index].row
    let c = pazzlsArray[pazzl2Index].col
    pazzlsArray[pazzl2Index].row = pazzlsArray[pazzl1Index].row
    pazzlsArray[pazzl2Index].col = pazzlsArray[pazzl1Index].col
    pazzlsArray[pazzl1Index].row = b
    pazzlsArray[pazzl1Index].col = c

    let pazzl1HTML = document.getElementById(`pazzl${pazzl1Index}`)
    let pazzl2HTML = document.getElementById(`pazzl${pazzl2Index}`)
    let a = pazzl2HTML?.style.top
    let d = pazzl2HTML?.style.left

    const css = window.document.styleSheets[0];
    let keyFrame1 = Math.floor(Math.random()*10000000000000)
    let keyFrame2 = Math.floor(Math.random()*10000000000000)
    
    css.insertRule(`
    @keyframes a${keyFrame2} {
    0%   { top: ${a}; 
            left: ${d};}

    100% { top: ${pazzl1HTML.style.top}; 
           left: ${pazzl1HTML.style.left}; }
    }`, css.cssRules.length);
    pazzl2HTML.style.animation = `a${keyFrame2} 0.25s ease`
    css.insertRule(`
    @keyframes a${keyFrame1} {
    0%   { top: ${pazzl1HTML.style.top}; 
            left: ${pazzl1HTML.style.left};}

    100% { top: ${pazzl2HTML.style.top}; 
           left: ${pazzl2HTML.style.left}; }
    }`, css.cssRules.length);
    pazzl1HTML.style.animation = `a${keyFrame1} 0.25s ease`
    

    pazzl2HTML.style.top = pazzl1HTML.style.top
    pazzl2HTML.style.left = pazzl1HTML.style.left
    pazzl1HTML.style.top = a
    pazzl1HTML.style.left = d
    setTimeout(() => {document.body.style.pointerEvents = "all"}, 250);
    
}

function checkWhiteNextPazzl(pazzl){
    if (pazzl.color == "white"){
        return false
    }
    else {
        for(let obj in pazzlsArray){
            if (pazzlsArray[obj].color == "white"){
               if(pazzlsArray[obj].col == pazzl.col && pazzlsArray[obj].row == pazzl.row - 1){
                return pazzlsArray[obj] //down pazzl, up white
               }

               else if(pazzlsArray[obj].col == pazzl.col && pazzlsArray[obj].row == pazzl.row + 1){
                return pazzlsArray[obj] // up pazzl, down white
               }

               else if(pazzlsArray[obj].col == pazzl.col + 1 && pazzlsArray[obj].row == pazzl.row){
                return pazzlsArray[obj] //left pazzl, right white
               }

               else if(pazzlsArray[obj].col == pazzl.col - 1 && pazzlsArray[obj].row == pazzl.row){
                return pazzlsArray[obj] // rigth pazzl, left white
               }
            }
        }
        return false
    }
} 

function checkCombinations(){
    // debugger
    let com1 = 0
    let com2 = 0
    let com3 = 0

    for (let l in pazzlsArray){
        if (pazzlsArray[l].color == "blue" && pazzlsArray[l].row == 0){
            com1 += 1
        }
        else if (pazzlsArray[l].color == "yellow" && pazzlsArray[l].col == 0){
            com2 += 1
        }
        else if (pazzlsArray[l].color == "red" && pazzlsArray[l].row + pazzlsArray[l].col == 3){
            com3 += 1
        }
    }
    return [com1, com2, com3]
}

function randomKey(obj) {
    let result;
    let count = 0;
    for (let prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

function createPazzl(color, row, col){
    let localPazzl = {
        color: color,
        col: col,
        row: row,
    }
    return localPazzl
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}




function addToDOM(obj, num){
    let HTMLpazzl = document.createElement("button")
    HTMLpazzl.style.backgroundColor = obj.color
    HTMLpazzl.style.left = `${obj.col * PAZZL_WIDTH + EXTRA_PADDING*(obj.col+1) }px`
    HTMLpazzl.style.top = `${obj.row * PAZZL_HEIGHT +EXTRA_PADDING*(obj.row+1) }px`
    HTMLpazzl.className = "pazzl"
    HTMLpazzl.id = `pazzl${num}`
    if (obj.color == "white"){
        HTMLpazzl.style.backgroundImage = 'url("data:image/jpeg;base64,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")'
        HTMLpazzl.style.backgroundSize ="cover"
    }
    MAP_ELEMENT.appendChild(HTMLpazzl)
    return HTMLpazzl
}

