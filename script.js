var s = "type"

Array.prototype.contains = function(v) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
      if (!arr.contains(this[i])) {
        arr.push(this[i]);
      }
    }
    return arr;
}

window.onload = function(){
    document.getElementById("search").onchange = search;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.has("q")){
        search(urlParams.get("q"))
        document.querySelector("#search").value = urlParams.get("q")
    }else{
        renderItems(sort(items))
    }
}

function sortType(type){
    s = type
    renderItems(sort(items))
}

function sort(items){
    switch(s){
        case 'type':
            var sorted = []
            var types = items.map(item => item.type).unique()
            types.forEach(type => {
                sorted.push(...items.filter(item => item.type == type))
            });
            return sorted
        case 'outfit':
            var sorted = []
            var outfits = items.map(item => item.set).unique()
            outfits.forEach(outfit => {
                sorted.push(...items.filter(item => item.set == outfit))
            });
            return sorted
        case 'date':
            return items.sort((a,b) => {return a.added - b.added})
        default:
            return items
    }
}

function search(input){
    var val = input.value || input
    typeof val == "object" ? val = input.target.value : ""
    console.log(`Searching "${val}", sorting mode "${s}"`)
    var filtered = items.filter(item => JSON.stringify(item).toLowerCase().includes(val.toString().trim().toLowerCase()))
    renderItems(sort(filtered))
}

function renderItems(items){
    document.querySelector("#card-container").innerHTML = "";
    var detailTemplate = document.querySelector("#item-detail-t")
    var cardTemplate = document.querySelector("#item-card-t")
    items.forEach(item => {
        var cardClone = document.importNode(cardTemplate.content, true)
        cardClone.querySelector(".item-name").innerText = item.name
        var type = ""
        switch(item.type){
            case "gravestone": type = "Gravestone"; break;
            case "hat": type = "Hat"; break;
            case "hair": type = "Hair"; break;
            case "glasses": type = "Glasses"; break;
            case "shirt": type = "Shirt"; break;
            case "eyes": type = "Eyes"; break;
            case "mouth": type = "Mouth"; break;
            case "mask": type = "Mask"; break;
            case "foreground": type = "Foreground Item"; break;
            case "background": type = "Background Item"; break;
            case "badge": type = "Badge"; break;
        }
        cardClone.querySelector(".item-type").innerHTML = type
        cardClone.querySelector(".item-creator").innerText = "by " + item.creator.join(" and ")
        cardClone.querySelector(".item-image").src = item.image
        var details = cardClone.querySelector(".item-details")

        var detailClone;
        detailClone = document.importNode(detailTemplate.content, true)
        if(item.set != null){
            detailClone.querySelector("li").innerHTML = `Part of <b><a href="${sets.filter(set => set.name == item.set)[0].image}">${item.set}</a></b>. <a href="?q=${item.set}"><code>Filter items</code></a>`
            details.appendChild(detailClone, true)
        }
        detailClone = document.importNode(detailTemplate.content, true)
        var originHTML = ""
        switch(item.origin){
            case "coins": originHTML = `<img src="https://cdn.discordapp.com/attachments/708636816667836498/710970333917610075/silver_coin3x-1.png" style="object-fit: contain;height: 1em;"/> ${item.coins}`; item.level == null ? "" : originHTML += ". Requires level " + item.level; break;
            case "roses": originHTML = `<img src="https://cdn.discordapp.com/attachments/708636816667836498/710972118216605776/assets_images_rose-1.png" style="object-fit: contain;height: 1em;"/> ${item.roses}`; break;
            case "tokens": originHTML = `${item.tokens} loyality tokens`; break;
            case "shop": originHTML = `Can only be purchased in the shop`; break;
            case "quest": originHTML = `Clan quest item`; break;
            case "secret": originHTML = `Secret item`; break;
            case "social-media": originHTML = `Social-media reward`; break;
            case "staff": originHTML = `Only given to staff`; break;
            case "tc": originHTML = `Only obtainable on the Testers Club`; break;
            case "ads": originHTML = `<img src="https://raw.githubusercontent.com/google/material-design-icons/master/av/2x_web/ic_play_circle_outline_black_48dp.png" style="object-fit: contain;height: 1em;"/> You get this item by watching ads`; break;
        }
        detailClone.querySelector("li").innerHTML = originHTML;
        details.appendChild(detailClone, true);

        var addedAt = new Date(item.added * 1000)
        cardClone.querySelector(".item-added").innerHTML = `Added ${addedAt.toLocaleDateString()}`

        document.querySelector("#card-container").appendChild(cardClone)
    });
}