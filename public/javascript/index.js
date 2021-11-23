

/**
 * Method to save the values of the profile
 * @returns {Object} Values to create a new profile 
 */
function getProfile() {
    const profile = {
        utNumber: document.getElementById('utNumberInput').value,
        dato: document.getElementById('datoInput').value,
        godsType: document.getElementById('godsartInput').value,
        vognLitra: document.getElementById('vognlitraInput').value,
        axleDistance: document.getElementById('axleDistance').value,
        axleDistanceInBoogie: document.getElementById('axleDistanceInBoogieInput').value,
        axleCount: document.getElementById('axleCountInput').value,
        godsLenght: document.getElementById('godslengthInput').value,
        osDistanceFromAxleToBoogie: document.getElementById('outsideDistanceFromAxelToBoogie').value,
        isDistanceFromAxleToBoogie: document.getElementById('insideDistanceFromAxelToBoogie').value,
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
        var foundUTNumber
        let url = '/api/profiles'
        var profile = getProfile()
        await findByUT(profile.utNumber).then(data => { foundUTNumber = data.utNumber })
        if (foundUTNumber == profile.utNumber) {
            await update(url += '/' + foundUTNumber, profile)
            getSnackbar('Profil opdateret')
            clearInputFields()
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

async function searchForProfile() {
    var searchNumber = document.getElementById("searchInput").value
    if (searchNumber.trim() == "") getSnackbar("Indtast et nummer")
    else {
        try {
            await findByUT(searchNumber).then(data => {
                const utInput = document.getElementById('utNumberInput')
                if (data.utNumber == searchNumber) {
                    utInput.value = data.utNumber
                    document.getElementById('datoInput').value = data.dato
                    document.getElementById('godsartInput').value = data.godsType
                    document.getElementById('vognlitraInput').value = data.vognLitra
                    document.getElementById('axleDistance').value = data.axleDistance
                    document.getElementById('axleDistanceInBoogieInput').value = data.axleDistanceInBoogie
                    document.getElementById('axleCountInput').value = data.axleCount
                    document.getElementById('godslengthInput').value = data.godsLenght
                    document.getElementById('insideDistanceFromAxelToBoogie').value = data.isDistanceFromAxleToBoogie
                    document.getElementById('outsideDistanceFromAxelToBoogie').value = data.osDistanceFromAxleToBoogie
                    makeInputFields(data.xAxis.length)
                    fillXAndY(data.xAxis, data.yAxis)

                    document.getElementById('searchInput').value = ""
                    document.getElementById('clearBtn').style.display = "block"
                    document.getElementById('deleteBtn').style.display = "block"
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
searchBtn.onclick = searchForProfile

async function deleteProfile() {
    const utNumber = document.getElementById('utNumberInput').value
    let accept = confirm("Vil du virkelig slette UT nummer: " + utNumber)
    if (accept) {
        const response = deLete('/api/profiles/' + utNumber)
        if (response) {
            getSnackbar("Profilen er slettet")
            clearInputFields()
        }
    }
    else showSnackbar('Noget gik galt!')
}
deleteBtn.onclick = deleteProfile

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
    }
}

function clearInputFields() {
    let myForm = document.getElementById('form')
    let textInputs = myForm.querySelectorAll('input[type=text]')
    for (var i in textInputs) {
        textInputs[i].value = ""
        document.getElementById('utNumberInput').readOnly = false
        document.getElementById('clearBtn').style.display = "none"
        document.getElementById('deleteBtn').style.display = "none"
    }
    document.getElementById('xInputs').innerHTML = ""
    document.getElementById('yInputs').innerHTML = ""
    myForm.querySelector('input[type=date]').value = ""
}
clearBtn.onclick = clearInputFields



function getXValues() {
    let xArray = []
    let myDiv = document.getElementById('x-axis')
    let inputs = myDiv.querySelectorAll('input[type=text]')
    for (var i in inputs) {
        if (inputs[i].id != undefined && inputs[i].value.trim() != "") xArray.push(parseInt(inputs[i].value))
    }
    return xArray
}

function getYValues() {
    let yArray = []
    let myDiv = document.getElementById('y-axis')
    let inputs = myDiv.querySelectorAll('input[type=text]')
    for (var i in inputs) {
        if (inputs[i].id != undefined && inputs[i].value.trim() != "") yArray.push(parseInt(inputs[i].value))
    }
    return yArray
}

function fillXAndY(xArray, yArray) {


    let xDiv = document.getElementById('x-axis')
    let inputs = xDiv.querySelectorAll('input[type=text]')
    if (xArray != "") {
        for (var x in inputs) {
            if (!xArray[x]) inputs[x].value = ""
            else inputs[x].value = xArray[x]
        }
    }

    if (yArray != "") {
        let yDiv = document.getElementById('y-axis')
        inputs = yDiv.querySelectorAll('input[type=text]')
        for (var y in inputs) {
            if (!yArray[y]) inputs[y].value = ""
            else inputs[y].value = yArray[y]
        }
    }
}

function makeInputFields(antal) {
    let xAxis = document.getElementById('xInputs')
    let yAxis = document.getElementById('yInputs')
    xAxis.innerHTML = ""
    yAxis.innerHTML = ""
    //var antal = document.getElementById('inputCount').value
    for (let i = 0; i < antal; i++) {
        xAxis.innerHTML += '<input type="text">'
        yAxis.innerHTML += '<input type="text">'
    }
}




















