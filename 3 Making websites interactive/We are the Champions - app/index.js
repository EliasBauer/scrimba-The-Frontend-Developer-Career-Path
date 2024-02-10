import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-a2dfe-default-rtdb.europe-west1.firebasedatabase.app/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDb = ref(database, "endorsements")

const endorsementEl = document.getElementById("text-input")
const fromEl = document.getElementById("from-input")
const toEl = document.getElementById("to-input")
const publishButtonEl = document.getElementById("add-button")
const endorsementList = document.getElementById("endorsement-list")

publishButtonEl.addEventListener("click", function() {
    let endorsementObject = createEndorsementObject()

    if (Object.keys(endorsementObject).length === 0){
        return
    }
    push(endorsementsInDb, endorsementObject)
    clearElements()
})

onValue(endorsementsInDb, function(snapshot) {
    if (snapshot.exists()){
        let endorsementsArray = Object.entries(snapshot.val())
        
        clearEndorsementList()
        
        for (let i = endorsementsArray.length - 1; i >= 0; i--){
            let currentItem = endorsementsArray[i]
            
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        endorsementList.innerHTML = "Currently no Endorsements"
    }
})

function createEndorsementObject(){
    let checkInput = []
    let endorsementObject = {}
    const textValue = endorsementEl.value
    const fromValue = fromEl.value
    const toValue = toEl.value
    
    checkInput.push(checkInputFields(endorsementEl))
    checkInput.push(checkInputFields(fromEl))
    checkInput.push(checkInputFields(toEl))

    if (!checkInput.every(v => v === true)){
        return endorsementObject
    } else {
        endorsementObject = {
            to: toValue,
            text: textValue,
            from: fromValue,
            likes: 0
        }
    }
    return endorsementObject
}

function checkInputFields(element){
    if (element.value === "") {
        element.classList.add("red")
        return false
    }
    element.classList.remove("red")
    return true
}

function clearElements(){
    endorsementEl.value = ""
    fromEl.value = ""
    toEl.value = ""
}

function clearEndorsementList(){
    endorsementList.innerHTML = ""
}

function appendItemToShoppingListEl(item){
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    newEl.innerHTML = `
    <span class="strong address ">To ${itemValue["to"]}</span>
    ${itemValue["text"]}
    <div class="strong address" style="display:flex; justify-content:space-between">
        <span> From ${itemValue["from"]} </span>
        <span> 🖤 ${itemValue["likes"]} </span>
    </div>
    `
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`)
        
        addLike(exactLocationOfItemInDB)
    })
    
    endorsementList.append(newEl)
}

function addLike(exactLocationOfItemInDB){
    
}