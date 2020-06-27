const renderMaxItems = 200
const urlParams = new URLSearchParams(window.location.search);
window.onload = function(){
    restoreDefaultSort()
    if(urlParams.has("s")){
        currentPage = parseInt(urlParams.get("s"))
        if(isNaN(currentPage)){
            urlParams.set("s", "0")
            window.location.search = urlParams
        }
    }else{
        currentPage = 0
    }
    if(urlParams.has("q")){
        searchText(urlParams.get("q"))
    }
    renderItems(currentPage, renderMaxItems)
    if(currentPage > items_sorted.length){
        urlParams.set("s", "0")
        window.location.search = urlParams
    }
    if(currentPage == 0){
        document.querySelector("#pgBck").hidden = "true"
    }
    if(currentPage + renderMaxItems >= items_sorted.length){
        document.querySelector("#pgFwd").hidden = "true"
    }
}

const roseImage = "https://cdn.discordapp.com/attachments/708636816667836498/710972118216605776/assets_images_rose-1.png"
const coinImage = "https://cdn.discordapp.com/attachments/708636816667836498/710970333917610075/silver_coin3x-1.png"
const gemImage = "https://cdn.discordapp.com/attachments/708636816667836498/710971545018957864/assets_images_gem_pile_1.png"

function addItem(item){
    var c = new Card("item-card-t")
        .addToDocumentByID("card-container")
        .setBorder(item.rarity == "COMMON" ? "gray" : item.rarity == "RARE" ? "DodgerBlue" : item.rarity == "EPIC" ? "purple" : item.rarity == "LEGENDARY" ? "gold" : "gray")
        .setHeader(item.name)
        .setImage(item.image)
    if(item.costGems != -1){
        c.setLine1(`<center><img style="height: 1.12em;" src="${gemImage}">${item.costGems}</center>`)
    }else if(item.costRoses != -1){
        c.setLine1(`<center><img style="height: 1.12em;" src="${roseImage}">${item.costRoses}</center>`)
    }else if(item.costCoins != -1){
        c.setLine1(`<center><img style="height: 1.12em;" src="${coinImage}">${item.costCoins}</center>`)
    }
    if(item.itemSet != undefined){
        c.setLine2(`Item set: <code>${item.itemSet}</code>`)
    }
}

function searchText(text){
    items_sorted = items_sorted.filter(item => JSON.stringify(item).toLowerCase().includes(text.toLowerCase()))
}

function restoreDefaultSort(){
    items_sorted = items
}

function renderItems(start, amount){
    clearElement("card-container")
    items_sorted.slice(start, start+amount).forEach(el => {
        addItem(el)
    })
}