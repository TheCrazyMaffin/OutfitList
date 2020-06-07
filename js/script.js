const itemsPerPage = 200;

window.onload = function(){
    document.getElementById("search").onchange = Events.query;
     reload()
}

var Events = {
    query: function(target){
        var url = new URL(window.location.href)
        var val = target.value || target
        typeof val == "object" ? val = target.target.value : ""
        url.searchParams.set("q", val)
        window.location.href = url.toString()
    },
    pageBack: function(){
        var url = new URL(window.location.href)
        var currentIndex = url.searchParams.has("i") ? parseInt(url.searchParams.get("i")) : 0;
        currentIndex == 0 ? url.searchParams.delete("i") : url.searchParams.set("i", --currentIndex);
        window.location.href = url.toString()
    },
    pageForward: function(){
        var url = new URL(window.location.href)
        var currentIndex = url.searchParams.has("i") ? parseInt(url.searchParams.get("i")) : 0;
        var maxPages = getMaxPages()
        if(currentIndex < maxPages){
            url.searchParams.set("i", ++currentIndex);
        }
        window.location.href = url.toString()
    },
    clearQuery: function(){
        var url = new URL(window.location.href)
        url.searchParams.has("q") ? url.searchParams.delete("q") : "";
        window.location.href = url.toString()
    },
    sortSet: function(val){
        var url = new URL(window.location.href)
        url.searchParams.set("s", val)
        window.location.href = url.toString()
    }
}

function getMaxPages(){
    var url = new URL(window.location.href)
    var qItems = search(items, url.searchParams.has("q") ? url.searchParams.get("q") : "")
    console.log(`${qItems.length} match the query.`)
    return Math.ceil(qItems.length/itemsPerPage) - 1 //array starts at 0
}

function setPage(num){
    console.log("Set page to " + num)
    var url = new URL(window.location.href)
    url.searchParams.set("i", num)
    window.location.href = url.toString()
}

function reload(){
    var query = ""
    var sort = "type"
    var page = 0
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.has("q") ? query = urlParams.get("q") : query = "";
    urlParams.has("s") ? sort = urlParams.get("s") : sort = "type";
    urlParams.has("i") ? page = parseInt(urlParams.get("i")) : page = 0;
    document.querySelector("#currentIndex").innerText = page + 1
    document.querySelector("#search").value = query;
    page <= getMaxPages() ? "" : setPage(getMaxPages())
    var tempItems = items
    tempItems = search(tempItems, query)
    tempItems = sortItems(tempItems, sort)
    tempItems = getPage(tempItems, page)
    renderItems(tempItems)
}

/**
 * Sort oufit items
 * @param {Array<Object>} unsortedItems 
 * @param {String} type One of type, outfit, date or else returns unsortedItems
 * @returns {Array<Object>} Sorted items
 */
function sortItems(unsortedItems, type = "type"){
    console.log(`Sorting mode ${type}`)
    switch(type){
        case 'type':
            var sorted = []
            var types = unsortedItems.map(item => item.type).unique()
            types.forEach(type => {
                sorted.push(...unsortedItems.filter(item => item.type == type))
            });
            return sorted

        case 'outfit':
            var sorted = []
            var outfits = unsortedItems.map(item => item.set).unique()
            outfits.forEach(outfit => {
                sorted.push(...unsortedItems.filter(item => item.set == outfit))
            });
            return sorted

        case 'date':
            return unsortedItems.sort((a,b) => {return a.added - b.added})

        default:
            return unsortedItems
    }
}

/**
 * @returns {Array<Object>} Filtered items
 * @param {Array<Object>} unsearchedItems  Array of Outfit items
 * @param {String} query A String to look for
 */
function search(unsearchedItems, query){  
    console.log(`Searching "${query}""`);
    searchTerm = query.toString().trim().toLowerCase();
    var filtered = unsearchedItems.filter(item => JSON.stringify(item).toLowerCase().includes(searchTerm));
    return filtered;
}

function getPage(allItems, page = 0){
    return allItems.slice(page * itemsPerPage, (page * itemsPerPage) + (itemsPerPage))
}

function renderItems(items = []){
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