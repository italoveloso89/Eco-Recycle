
function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res =>  res.json() )
    .then(states => {

        for(const state of states){
            ufSelect.innerHTML += `<option value ="${state.id}">${state.nome}</option>`
        }
        
    })

}

populateUFs()

function getCities(event){
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = (event.target.value)

    const indexSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexSelectedState].text


    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`


    citySelect.innerHTML = "<option value>Selecione a cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res =>  res.json() )
    .then(cities => {

        for(const city of cities){
            citySelect.innerHTML += `<option value ="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    })

}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)


// Itens to collect
//Get all from Li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem)
}


const collectedItems = document.querySelector("input[name=items]")


let selectedItems = []

function handleSelectedItem(event){
    const itemLi = event.target

    //Add or remove a class
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    console.log('ITEM ID: ', itemId)


    // verify if exist items sellected, if yes
    // get items selected

    const alreadySelected = selectedItems.findIndex(item => {
        const itemFound = item ==itemId //true or false
        return itemFound
    })


    // if already selected 
    if(alreadySelected >= 0){
        // remove from selection
        const filteredItems = selectedItems.filter(item => {
            const itemsIsDifferent = item != itemId
            return itemsIsDifferent 
        })

        selectedItems = filteredItems
    } else {
        //if not seleceted, add to selection
        selectedItems.push(itemId)
    }

    console.log('selectedItems: ', selectedItems)

    // update hidden field with selected items
    collectedItems.value = selectedItems

}