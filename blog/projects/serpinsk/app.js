document.getElementById('startButton').addEventListener('click', function() {
    const numberInput = Number(document.getElementById('numberInput').value);
    if (Number.isInteger(numberInput) && numberInput > 0 && numberInput <= 10000) {
        document.querySelectorAll('.point, .mainPoint').forEach(point => point.remove());

        let pointA = document.createElement("div")
        let pointB = document.createElement("div")
        let pointC = document.createElement("div")
        let currentPoint = document.createElement("div")
        let currentX = 50
        let currentY = 1
        let aX = 1
        let aY = 1
        let bX = 99
        let bY = 1
        let cX = 50
        let cY = 99
        let i = 0

        createPoint(pointA, "mainPoint", `${aX}%`, `${aX}%`)
        createPoint(pointB, "mainPoint", `${bX}%`, `${bY}%`)
        createPoint(pointC, "mainPoint", `${cX}%`, `${cY}%`)
        createPoint(currentPoint, "point", `${currentX}%`, `${currentY}%`)
        function getRandomArbitraryCorner() {
            let min = Math.ceil(1);
            let max = Math.floor(3);
            let corner = Math.floor(Math.random() * (max - min + 1)) + min;
            if (corner === 1){
                return [aX, aY]
            }
            else if (corner === 2){
                return [bX, bY]
            } 
            return [cX, cY]
        }

        function createPoint(point, className, left, top){
            point.style.left = left
            point.style.top = top
            point.className = className
            document.body.appendChild(point)
        }

        while(i < numberInput){
            currentPoint = document.createElement("div")
            let randomCorner = getRandomArbitraryCorner()
            currentX = (randomCorner[0]+currentX) / 2
            currentY = (randomCorner[1]+currentY) / 2

            createPoint(currentPoint, "point", `${currentX}%`, `${currentY}%`)
            i++
            if (i == numberInput){
                break
            }
        }
} else {
    alert('Please enter a whole number between 1 and 10000.');
}
});
