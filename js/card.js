class Card{
    constructor(templateID){
        this._element = document.querySelector(`#${templateID}`).content.cloneNode(true)
        this._card = this._element.querySelector(".card")
    }

    addToDocumentByID(elementID){
        document.querySelector(`#${elementID}`).append(this._element)
        return this
    }

    setBorder(color, width = "5px"){
        this._card.style["border-color"] = color;
        this._card.style["border-width"] = width;
        return this
    }

    setHeader(text){
        this._card.querySelector(".card-header").innerHTML = text;
        return this
    }

    setImage(src){
        this._card.querySelector("img").src = src;
        return this;
    }

    setLine1(text){
        this._card.querySelector(".line1").innerHTML = text;
    }

    setLine2(text){
        this._card.querySelector(".line2").innerHTML = text;
    }

    setLine3(text){
        this_.card.querySelector(".line3").innerHTML = text;
    }

    setLine4(text){
        this._card.querySelector(".line4").innerHTML = text;
    }

    setLine5(text){
        this._card.querySelector(".line5").innerHTML = text;
    }
}

function clearElement(elementID){
    document.querySelector(`#${elementID}`).innerHTML = "";
}