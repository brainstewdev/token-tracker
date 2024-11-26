const BASE_API_URL = "https://api.magicthegathering.io/v1/cards?Layout=token"; 
var TOKENS = []; 

class Token{
    constructor(name){
        this.totalCount = 1
        this.tappped = 0
        this.name = name
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

function addCard(){
    let name = document.getElementById("token_name_input").value
    TOKENS.push(new Token(name))
    updateView()
}

function updateView(){
    drawCard()
}

function drawCard(){
    innerHTMLresult = ""
    TOKENS.forEach(element => {
        innerHTMLresult += HTMLCardRepresentation(element)
    });
    document.getElementById("cardHolder").innerHTML = innerHTMLresult
}
function HTMLCardRepresentation(token){
    return `<div class="card" style="width: 18rem;"><div class="card-body"><h5 class="card-title">${token.name}</h5>
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
    TOKENS.find(token => token.name === name).decrement()
    if(TOKENS.find(token => token.name === name).totalCount == 0){
        TOKENS.splice( TOKENS.indexOf(TOKENS.find(token => token.name === name)),1)
    }
    updateView();
}