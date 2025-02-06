// document.getElementsByClassName("products")[0].textContent = "" //cleaner
createElements(TECH, true, true, false)
let techNow = TECH

document.getElementById("rating")?.addEventListener("click", ()=>{ 
    if(user.login === false) alert("You arent log in");
    else{
    let newTech = techNow.sort((a, b)=>b.rating-a.rating)
    console.log(newTech);
    createElements(newTech)
    }
})

document.getElementById("chep-exp")?.addEventListener("click", ()=>{
    if(user.login === false) alert("You arent log in")
    else{
    let newTech = techNow.sort((a, b)=>a.price-b.price)
    console.log(newTech);
    createElements(newTech)
    }
})

document.getElementsByClassName("logout")[0]?.addEventListener("click", ()=>{
    user = {
        login: false
    }
    fromTo("autorisated","not-autorisated" )
    document.getElementsByClassName("not-autorisated")[0].style.position = "relative"
    document.getElementsByClassName("autorisated")[0].style.position = "absolute"
    createElements(TECH)
})

document.getElementById("exp-chep")?.addEventListener("click", ()=>{
    if(user.login === false) alert("You arent log in")
    else{
    let newTech = techNow.sort((a, b)=>b.price-a.price)
    console.log(newTech);
    createElements(newTech)
    }
})

document.getElementById("all")?.addEventListener("click", ()=>{
    if(user.login === false) alert("You arent log in")
    else{
    techNow = TECH
    createElements(techNow)
    }
})

document.getElementsByClassName("basket-btn")[0]?.addEventListener("click", ()=>{
    console.log("clicked on basket");
    fromTo("main__page", "totall__page")
    document.getElementsByClassName("autorisated")[0].style.visibility = "hidden"
    createElements(TECH, false, false, false)
})

document.getElementById("mobiles")?.addEventListener("click", ()=>{
    if(user.login === false) alert("You arent log in")
    else{
    techNow = MOBILES
    console.log("object");
    createElements(techNow)
    }
})

document.getElementById("tvs")?.addEventListener("click", ()=>{
    if(user.login === false) alert("You arent log in")
    else{techNow = TV
    console.log("object");
    createElements(techNow)
    }
})

document.getElementById("main_page__reg")?.addEventListener("click", ()=>{
    document.getElementsByClassName("not-autorisated")[0].style.visibility = "visible"
    fromTo("regin__page","main__page")
})


document.getElementById("main_page__log")?.addEventListener("click", ()=>{
    document.getElementsByClassName("not-autorisated")[0].style.visibility = "visible"
    fromTo("login__page","main__page")
})

// main_page__totall
document.getElementById("main_page__totall")?.addEventListener("click", ()=>{
    document.getElementsByClassName("autorisated")[0].style.visibility = "visible"
    fromTo("totall__page","main__page")
})

document.getElementById("login")?.addEventListener("click", ()=>{
    fromTo("main__page", "login__page")
    document.getElementsByClassName("not-autorisated")[0].style.visibility = "hidden"
})

document.getElementById("signin")?.addEventListener("click", ()=>{
    fromTo("main__page", "regin__page")
    document.getElementsByClassName("not-autorisated")[0].style.visibility = "hidden"
    
})

function makeListner(){
    for (let idCart in TECH){
        console.log(idCart);
        document.getElementById(`buy-btn-${idCart}`)?.addEventListener("click", () => {
            if(!user.login) alert("You arent log in")
            else{
                if (TECH[idCart].price > user.money){
                    alert("Not enough money")
                }
                else {
                    user.money -= TECH[idCart].price
                    user.money = user.money.toFixed(2)
                    user.purchases.push(TECH[idCart].id)
                    document.getElementsByClassName("money")[0].innerHTML = "£"+user.money
                }
                
            }
            console.log(user.purchases);
        })
    }
}
makeListner()
function loginCheck(form){
    if (user.login == true){
        alert("Sorry, you already log in")
    }
    else{
        let email = document.forms[form]["email"].value;
        let password = document.forms[form]["password"].value;
        for (let member in USERS){
            if (USERS[member].email === email){
                if (USERS[member].password === password){
                    user = USERS[member]
                    alert("You loged in!")
                    fromTo("login__page", "main__page")
                    replaceToAutorise(user)
                    break
                }
            }
        }
        if (user.login != true){
            alert("password or email is wrong, try again")
        }
    }
    return false
}


function validateForm(form) {
    let fname = document.forms[form]["fname"].value;
    let sname = document.forms[form]["sname"].value;
    let age = document.forms[form]["age"].value;
    let email = document.forms[form]["email"].value;
    let password = document.forms[form]["password"].value;
    let avatar = document.forms[form]["avatar"].value;
    
    console.log(fname.length );
    if (fname.length < 3) {
      alert("Name must be more than 2");
      return false;
    }
    if (sname.length < 3) {
        alert("Second name must be more than 2");
        return false;
    }
    if (age < 3 || age > 100) {
        alert("Please write your age normal");
        return false;
    }
    if (!email.includes("@")) {
        alert("Email is wrong");
        return false;
    }
    if (password.length < 8 || password.length > 18) {
        alert("password invalid langth");
        return false;
    }
    let chekEmailFlag = false
    for (let member in USERS){
        if (USERS[member].email === email) {
            chekEmailFlag = true
            break
        }
        else chekEmailFlag = false
    }
    if (chekEmailFlag === true){
        alert("this email used now");
        return false; 
    }
    alert("you autorisated");
    user.login = true
    user.fname = fname
    user.sname = sname
    user.age = age
    user.email = email
    user.password = password
    user.avatar = avatar
    user.money = 1000
    user.purchases = []
    console.log('%capp.js line:99 user', 'color: #007acc;', user);
    fromTo("regin__page", "main__page")
    replaceToAutorise(user)
    return false;
  }

function fromTo(from, to){
    document.getElementsByClassName(from)[0].style.visibility = "hidden"
    document.getElementsByClassName(to)[0].style.visibility = "visible"
}

function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

function replaceToAutorise(user){
    let autoris = document.getElementsByClassName("autorisated")[0]
    let notAutoris = document.getElementsByClassName("not-autorisated")[0]
    if (isImage(user.avatar) == true){
        console.log("ALL GOOOD");
        document.getElementsByClassName("user-avatar")[1].src = user.avatar
        document.getElementsByClassName("user-avatar")[0].src = user.avatar
    }
    else{
        document.getElementsByClassName("user-avatar")[1].src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZlr0nV3MSR5rc0souSDovrbJ1NIj--YEqwQ&usqp=CAU"
        document.getElementsByClassName("user-avatar")[0].src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZlr0nV3MSR5rc0souSDovrbJ1NIj--YEqwQ&usqp=CAU"
    }
    document.getElementsByClassName("money")[0].innerHTML = "£"+user.money
    document.getElementsByClassName("user-name")[0].innerHTML = user.fname
    document.getElementsByClassName("user-name")[1].innerHTML = user.fname
    autoris.style.visibility = "visible"
    notAutoris.style.visibility = "hidden"
    notAutoris.style.position = "absolute"
    autoris.style.position = "relative"
}
function createElements(TECH, main = true, first = false, makeListnerFunc = true){
    // debugger
    if (main){
        document.getElementsByClassName("products")[0].textContent = "" 
        for (let item in TECH){
            if (first){
                TECH[item].id = item
            }
            let itemDOM = document.createElement("div")
            itemDOM.className = "cart"
        
            let itemWrapImg =  document.createElement("div")
            itemWrapImg.className = "product-img-wrapper"
        
            let itemImage = document.createElement("img")
            itemImage.className = "product-img"
            itemImage.src = TECH[item].imgURL
            itemWrapImg.appendChild(itemImage)
        
            let itemName = document.createElement("div")
            itemName.className = "product-name"
            itemName.innerHTML = TECH[item].title
        
            let itemDescription = document.createElement("div")
            itemDescription.className = "description"
            itemDescription.innerHTML = "Description:"
            for (let option in TECH[item].description){
                itemDescription.appendChild(document.createElement("br"))
                itemDescription.innerHTML += `- ${option}: ${TECH[item].description[option]}`
            }
            itemDescription.appendChild(document.createElement("br"))
            itemDescription.innerHTML += `- rating: ${TECH[item].rating}`
        
            let itemPrice = document.createElement("div")
            itemPrice.className = "product-price"
            itemPrice.innerHTML = "£"+TECH[item].price
        
            let itemButton = document.createElement("button")
            itemButton.className = "product-btn"
            itemButton.innerHTML = "Buy"
            itemButton.id = `buy-btn-${TECH[item].id}`
        
            itemDOM.appendChild(itemWrapImg)
            itemDOM.appendChild(itemName)
            itemDOM.appendChild(itemDescription)
            itemDOM.appendChild(itemPrice)
            itemDOM.appendChild(itemButton)
        
            document.getElementsByClassName("products")[0].appendChild(itemDOM)
        }
    console.log('%capp.js line:270 TECH', 'color: #007acc;', TECH);
    if (makeListnerFunc){
        makeListner()
    }
    }
    else{
        let count = 0
        document.getElementsByClassName("purchases")[0].textContent = "" 
        for (let idPurchas in user.purchases){
            for(let item in TECH){
                if (TECH[item].id == user.purchases[idPurchas]){
                    let itemDOM = document.createElement("div")
                    itemDOM.className = "cart"
                
                    let itemWrapImg =  document.createElement("div")
                    itemWrapImg.className = "product-img-wrapper"
                
                    let itemImage = document.createElement("img")
                    itemImage.className = "product-img"
                    itemImage.src = TECH[item].imgURL
                    itemWrapImg.appendChild(itemImage)
                
                    let itemName = document.createElement("div")
                    itemName.className = "product-name"
                    itemName.innerHTML = TECH[item].title
                
                    let itemPrice = document.createElement("div")
                    itemPrice.className = "product-price"
                    itemPrice.innerHTML = "£"+TECH[item].price
                
                    let itemButton = document.createElement("button")
                    itemButton.className = "product-btn"
                    itemButton.innerHTML = "Cancel"
                    itemButton.id = `cancel-btn-${count}`
                
                    itemDOM.appendChild(itemWrapImg)
                    itemDOM.appendChild(itemName)
                    itemDOM.appendChild(itemPrice)
                    itemDOM.appendChild(itemButton)
                
                    document.getElementsByClassName("purchases")[0].appendChild(itemDOM)
                }
            }
        }
    }
}