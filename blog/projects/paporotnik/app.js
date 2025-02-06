document.getElementById('startButton').addEventListener('click', function() {
    const numberInput = document.getElementById('numberInput').value;
    if (numberInput && numberInput > 0) {
        
        let currentX = 0
        let currentY = 0
        let i = 0
        let a=0,b=0,e=0,c=0,d=0,f=0
        
        for (i; i<numberInput; i++){
            let currentPoint = document.createElement("div")
            getRandomArbitraryCorner()
            let x = (a * currentX) + (b * currentY) + e
            let y = (c * currentX) + (d * currentY) + f
            currentX = x, currentY = y
        
            createPoint(currentPoint, "point", `${-x*125+500}px`, `${y*100-100}px`)
        }
        
        function getRandomArbitraryCorner() {
            let corner = Math.random()
            if (corner < 0.85){
                a = 0.85, b = 0.04, c = -0.04, d = 0.85, e = 0, f = 1.6
            }
            else if (corner < 0.92){
                a = 0.2, b = -0.26, c = 0.23, d = 0.22, e = 0, f = 1.6
            } 
            else if (corner < 0.99){
                a = -0.15, b = 0.28, c = 0.26, d = 0.24, e = 0, f = 0.44
            } 
            else{
                a = 0, b = 0, c = 0, d = 0.16, e = 0
            }
        }
        
        function createPoint(point, className, left, top){
            point.style.left = left
            point.style.top = top
            point.className = className
            document.body.appendChild(point)
        }
    } else {
        alert('Please enter a valid number between 1 and 1000.');
    }
});





