Events = {
    sortSet: (sortType) => {
        switch(sortType){
            case "itemset":

            break;
            case "rarity":

            break;
            default://Date added
                restoreDefaultSort();
            break;
        }
    },

    pageForward: () => {
        var currentPage = parseInt(urlParams.get("s"));
        urlParams.set("s", currentPage + renderMaxItems)
        window.location.search = urlParams.toString()
    },

    pageBack: () => {
        var currentPage = parseInt(urlParams.get("s"));
        if(currentPage - renderMaxItems < 0){
            urlParams.set("s", "0")
        }else{
            urlParams.set("s", currentPage - renderMaxItems)
        }
        window.location.search = urlParams.toString()
    },

    search(text = document.querySelector("#search").value){
        urlParams.set("q", text)
        window.location.search = urlParams
    }
}