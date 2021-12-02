// Buttons
let plusBtn = document.getElementById('plusBtn')
let minusBtn = document.getElementById('minusBtn')
let clearBtn = document.getElementById('clearBtn')
let deleteBtn = document.getElementById('deleteBtn')
let submitBtn = document.getElementById('submitBtn')
let searchBtn = document.getElementById('searchBtn')

// Inputs
let utNumberInput = document.getElementById('utNumberInput')
let datoInput = document.getElementById('datoInput')
let godsTypeInput = document.getElementById('godsartInput')
let vognLitraInput = document.getElementById('vognlitraInput')
let axleDistanceInput = document.getElementById('axleDistance')
let axleDistanceInBoogieInput = document.getElementById('axleDistanceInBoogieInput')
let axleCountInput = document.getElementById('axleCountInput')
let godsLenghtInput = document.getElementById('godslengthInput')
let osDistanceFromAxleToBoogieInput = document.getElementById('outsideDistanceFromAxelToBoogie')
let isDistanceFromAxleToBoogieInput = document.getElementById('insideDistanceFromAxelToBoogie')

// Else
let xAxis = document.getElementById('xInputs')
let yAxis = document.getElementById('yInputs')
let xDiv = document.getElementById('x-axis')
let yDiv = document.getElementById('y-axis')

// Sets minimum date to today in date input in section 1
let updating = false // Allow earlier date at update
let today = new Date()
let day = today.getDate()
let month = today.getMonth() + 1
let year = today.getFullYear()
let todayDate = `${year}-${month}-${day}`
if (day < 10) day = '0' + day
if (month < 10) month = '0' + month
datoInput.setAttribute('min', todayDate)

/**
 * Method to save the values of the profile
 * @returns {Object} Values to create a new profile 
 */
function getProfile() {
    const profile = {
        utNumber: utNumberInput.value,
        dato: datoInput.value,
        godsType: godsTypeInput.value,
        vognLitra: vognLitraInput.value,
        axleDistance: axleDistanceInput.value,
        axleDistanceInBoogie: axleDistanceInBoogieInput.value,
        axleCount: axleCountInput.value,
        godsLenght: godsLenghtInput.value,
        osDistanceFromAxleToBoogie: osDistanceFromAxleToBoogieInput.value,
        isDistanceFromAxleToBoogie: isDistanceFromAxleToBoogieInput.value,
        xAxis: getXValues(),
        yAxis: getYValues()
    }
    checkForEmptyInput()
    return profile
}

/**
 * To check if the UT number already is used in the Database
 * @param {Number} utNumber 
 * @returns If nothing found it will return an empty object. If a Profile is found, it will return that object
 */
async function findByUT(utNumber) {
    return await get('api/profiles/' + utNumber)
}

/**
 * Submit the new profile to the API and Database
 */
async function submit() {
    try {
        console.log("her")
        var foundUTNumber
        let url = '/api/profiles'
        var profile = getProfile()
        await findByUT(profile.utNumber).then(data => { foundUTNumber = data.utNumber })
        if (foundUTNumber == profile.utNumber) {
            updating = true
            await update(url += '/' + foundUTNumber, profile)
            getSnackbar('Profil opdateret')
            clearInputFields()
            updating = false
        }
        else var accept = confirm("VIL DU OPRETTE DENNE PROFIL?\n" + stringBuilder(profile))
        if (accept == true) {
            await post(url, profile)
            getSnackbar('Profil oprettet')
            clearInputFields()
        }
    } catch (error) {
        getSnackbar(error)
    }
}
submitBtn.onclick = submit;

/**
 * Search for an utNumber, found by the value in the #searchInput field
 */
async function searchForProfile() {
    let searchNumber = document.getElementById("searchInput").value
    if (searchNumber.trim() == "") getSnackbar("Indtast et nummer")
    else {
        try {
            await findByUT(searchNumber).then(data => {
                const utInput = utNumberInput
                if (data.utNumber == searchNumber) {
                    utInput.value = data.utNumber
                    datoInput.value = data.dato
                    godsTypeInput.value = data.godsType
                    vognLitraInput.value = data.vognLitra
                    axleDistanceInput.value = data.axleDistance
                    axleDistanceInBoogieInput.value = data.axleDistanceInBoogie
                    axleCountInput.value = data.axleCount
                    godsLenghtInput.value = data.godsLenght
                    isDistanceFromAxleToBoogieInput.value = data.isDistanceFromAxleToBoogie
                    osDistanceFromAxleToBoogieInput.value = data.osDistanceFromAxleToBoogie
                    makeInputFields(data.xAxis.length)
                    fillXAndY(data.xAxis, data.yAxis)

                    document.getElementById('searchInput').value = ""
                    clearBtn.style.display = "block"
                    deleteBtn.style.display = "block"
                    submitBtn.value = "Opdater"
                    utInput.readOnly = true

                } else {
                    getSnackbar("Det indtastet nummer finder ingen profil")
                }
            })
        } catch (error) {
            getSnackbar(error.message)
        }
    }
}

/**
 * Delete the profile, that is found by the search function 
 */
async function deleteProfile() {
    const utNumber = utNumberInput.value
    let accept = confirm("Vil du virkelig slette UT nummer: " + utNumber)
    if (accept) {
        const response = deLete('/api/profiles/' + utNumber)
        if (response) {
            getSnackbar("Profilen er slettet")
            clearInputFields()
            submitBtn.value = "Opret"
        }
    }
    else showSnackbar('Noget gik galt!')
}

/////////////////////////////////////////////////////
/////////////// Helper methods //////////////////////

/**
 * Builds a string to show the data of a profile
 * @param {Object} profile 
 * @returns {String} with all data of a profile
 */
function stringBuilder(profile) {
    var stringBuilder = []
    stringBuilder.push(`\nUT NUMMER: ${profile.utNumber}\n`,
        `DATO: ${profile.dato}\n`,
        `GODSTYPE: ${profile.godsType}\n`,
        `VOGNLITRA: ${profile.vognLitra}\n`,
        `AKSEL DISTANCE: ${profile.axleDistance}\n`,
        `AKSEL DISTANCE I BOOGIE: ${profile.axleDistanceInBoogie}\n`,
        `AKSELANTAL: ${profile.axleCount}\n`,
        `GODSLÆNGDE: ${profile.godsLenght}\n`,
        `INDV. AFSTAND FRA AKSEL TIL BOOGIE: ${profile.isDistanceFromAxleToBoogie}\n`,
        `UDDV. AFSTAND FRA AKSEL TIL BOOGIE: ${profile.osDistanceFromAxleToBoogie}\n`,
        `AFSTAND FRA VOGNMIDTE: ${getXValues()}\n`,
        `HØJDE FRA SO: ${getYValues()}\n`)


    return stringBuilder.join(``)
}

/**
 * Checks for empty input fields in first section
 */
function checkForEmptyInput() {
    let myForm = document.getElementById('form')
    let dateValue = myForm.querySelector('input[type=date]').value
    let textInputs = myForm.querySelectorAll('input[type=text]')
    for (var i in textInputs) {
        if (textInputs[i].id != undefined && textInputs[i].value.trim() == "" && i <= 8) throw "Udfyld venligst alle inputfelter"
        if (!dateValue) throw "Udfyld dato!"
        if (dateValue < todayDate && updating == false) throw `Dato skal være efter ${todayDate}`
    }
}

/**
 * Clear all input field in section 1
 */
function clearInputFields() {
    let myForm = document.getElementById('form')
    let textInputs = myForm.querySelectorAll('input[type=text]')
    for (var i in textInputs) {
        textInputs[i].value = ""
        utNumberInput.readOnly = false
        clearBtn.style.display = "none"
        deleteBtn.style.display = "none"
    }
    plusBtn.style.display = "none"
    minusBtn.style.display = "none"
    xAxis.innerHTML = ""
    yAxis.innerHTML = ""
    myForm.querySelector('input[type=date]').value = ""
    submitBtn.value = "Opret"
}


function getXValues() {
    let xArray = []

    let inputs = xDiv.querySelectorAll('input[type=text]')
    for (var i in inputs) {
        if (inputs[i].id != undefined && inputs[i].value.trim() != "") xArray.push(parseInt(inputs[i].value))
    }
    return xArray
}

function getYValues() {
    let yArray = []
    let inputs = yDiv.querySelectorAll('input[type=text]')
    for (var i in inputs) {
        if (inputs[i].id != undefined && inputs[i].value.trim() != "") yArray.push(parseInt(inputs[i].value))
    }
    return yArray
}

function fillXAndY(xArray, yArray) {
    let inputs = xDiv.querySelectorAll('input[type=text]')
    if (xArray != "") {
        for (var x in inputs) {
            if (!xArray[x]) inputs[x].value = ""
            else inputs[x].value = xArray[x]
        }
    }

    if (yArray != "") {
        inputs = yDiv.querySelectorAll('input[type=text]')
        for (var y in inputs) {
            if (!yArray[y]) inputs[y].value = ""
            else inputs[y].value = yArray[y]
        }
    }
}

function makeInputFields(antal) {
    if (antal > 0) {
        plusBtn.style.display = "block"
        minusBtn.style.display = "block"
    }
    else {
        plusBtn.style.display = "none"
        minusBtn.style.display = "none"
    }
    xAxis.innerHTML = ""
    yAxis.innerHTML = ""
    for (let i = 0; i < antal; i++) {
        let xinput = document.createElement('input')
        xinput.type = "text"
        let yinput = document.createElement('input')
        yinput.type = "text"
        xAxis.appendChild(xinput)
        yAxis.appendChild(yinput)
    }
}

function createOneInputField() {
    let xinput = document.createElement('input')
    xinput.type = 'text'
    let yinput = document.createElement('input')
    yinput.type = 'text'
    xAxis.appendChild(xinput)
    yAxis.appendChild(yinput)
}

function removeOneInputField() {
    let xinputs = xDiv.querySelectorAll('input[type=text]')
    let yinputs = yDiv.querySelectorAll('input[type=text]')
    if (xinputs.length == 1) {
        plusBtn.style.display = 'none'
        minusBtn.style.display = 'none'
    }

    xAxis.removeChild(xinputs[xinputs.length - 1])
    yAxis.removeChild(yinputs[yinputs.length - 1])
}


















