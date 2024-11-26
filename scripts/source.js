const BASE_API_URL = "https://api.scryfall.com/cards/named?layout=token&fuzzy="; 
var TOKENS = []; 

class Token{
    
    constructor(name){
        this.foundCard = false
        this.totalCount = 1
        this.tappped = 0
        this.name = name
    }
    setTrueCard(name, description, imageURL){
        this.foundCard = true
        this.totalCount = 1
        this.tappped = 0
        this.name = name
        this.description =description
        this.imageURL = imageURL
        return this
    }
    setCreatureCard(name, description, imageURL, power, toughness){
        this.foundCard = true
        this.totalCount = 1
        this.tappped = 0
        this.power = power
        this.toughness = toughness
        this.name = name
        this.description =description
        this.imageURL = imageURL
        return this
    }
    tap(){
        if(this.totalCount-this.tappped > 0){
            this.tappped++
        }
        return this.tappped
    }
    untap(){
        if(this.tappped > 0){
            this.tappped--
        }
        return this.tappped
    }
    untapAll(){
        this.tappped = 0
        return this.tappped
    }
    increment(){
        this.totalCount++
        return this.totalCounts
    }
    decrement(){
        this.totalCount--
        return this.totalCount
    }
}
// from https://stackoverflow.com/questions/247483/http-get-request-in-javascript
function httpGetAsync(url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function addCard(){
    let name = document.getElementById("token_name_input").value
    // get the card from the api (if it exists)
    httpGetAsync(BASE_API_URL+name, response => {
        const obj = JSON.parse(response);
        var token = new Token(name)
        if(obj["object"] === "card"){
            // card has been found, create the token based on the retrieved info
            // if it's a creature create it accordingly
            if(typeof(obj["toughness"]) == "undefined"){
                TOKENS.push(token.setTrueCard(obj["name"], obj["oracle_text"], obj["image_uris"]["art_crop"]))
            }else{
                TOKENS.push(token.setCreatureCard(obj["name"], obj["oracle_text"], obj["image_uris"]["art_crop"], obj["power"],obj["toughness"]))
            }
        }else{
            // card hasn't been found, create the token based on the name only.
            TOKENS.push(token)
        }
        // update the view
        updateView()
    });
}

function updateView(){
    console.log(TOKENS)
    drawCard()
}

function drawCard(){
    innerHTMLresult = ""
    TOKENS.forEach(element => {
        
        if(!element.foundCard){
            innerHTMLresult += HTMLCardRepresentation(element)
        }else{
            innerHTMLresult += HTMLCardRepresentationFromApi(element)
        }
    });
    document.getElementById("cardHolder").innerHTML = innerHTMLresult
}
function HTMLCardRepresentationFromApi(token){
    let text =`<div class="card" style="width: 18rem;"><div class="card-body">
    
    <div class="card-header">
    ${token.name}
    </div>
    <img src=${token.imageURL}  class="img-fluid"></img>
    <p class="card-text">${token.description}</p>`
    if(typeof(token.power) != "undefined"){
        text += `<h5 class="text-end">${token.power}/${token.toughness}</h5> `
    }
    text +=
    `<p class="card-text">tappati: ${token.tappped} / ${token.totalCount}</p>
    <button type="button" onclick="handleAdd('${token.name}')" class="btn btn-primary">+</button>
    /
    <button type="button" onclick="handleRemove('${token.name}')" class="btn btn-primary">-</button>
    
    <button type="button" onclick="handleTap('${token.name}')" class="btn btn-primary">tap</button>
    /
    <button type="button" onclick="handleUntap('${token.name}')" class="btn btn-primary">untap</button>
  </div>  
  </div><br>`
  return text;
}
function HTMLCardRepresentation(token){
    return `<div class="card" style="width: 18rem;"><div class="card-body">    
    <div class="card-header">
    ${token.name}
    </div>
      <p class="card-text">tappati: ${token.tappped} / ${token.totalCount}</p>
      <button type="button" onclick="handleAdd('${token.name}')" class="btn btn-primary">+</button>
      /
      <button type="button" onclick="handleRemove('${token.name}')" class="btn btn-primary">-</button>
      
      <button type="button" onclick="handleTap('${token.name}')" class="btn btn-primary">tap</button>
      /
      <button type="button" onclick="handleUntap('${token.name}')" class="btn btn-primary">untap</button>
    </div>  
    </div><br>`
}
function untapAll(){
    TOKENS.forEach(token => {
        token.untapAll()
    });
    updateView();
}

function handleTap(name){
    TOKENS.find(token => token.name === name).tap()
    updateView();
}
function handleUntap(name){
    TOKENS.find(token => token.name === name).untap()
    updateView();
}

function handleAdd(name){
    TOKENS.find(token => token.name === name).increment()
    updateView();
}

function handleRemove(name){
    if(TOKENS.find(token => token.name === name).totalCount == 0){
        TOKENS.splice( TOKENS.indexOf(TOKENS.find(token => token.name === name)),1)
    }else{
        TOKENS.find(token => token.name === name).decrement()
    }
    updateView();
}