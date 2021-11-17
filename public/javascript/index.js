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
        godsLenght: document.getElementById('godslengthInput').value
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
        var profile = getProfile()
        await findByUT(profile.utNumber).then(data => { foundUTNumber = data.utNumber })
        if (foundUTNumber == profile.utNumber) getSnackbar(`FEJL! UT NUMMER ${profile.utNumber} FINDES ALLEREDE I DATABASEN`)
        else var accept = confirm("VIL DU OPRETTE DENNE PROFIL?\n" + stringBuilder(profile))
        if (accept == true) {
            let url = '/api/profiles'
            await post(url, profile)
            getSnackbar('Profil oprettet')
            window.location.assign(`/`)
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
                if (data.utNumber == searchNumber) {
                    document.getElementById('utNumberInput').value = data.utNumber
                    document.getElementById('datoInput').value = data.dato
                    document.getElementById('godsartInput').value = data.godsType
                    document.getElementById('vognlitraInput').value = data.vognLitra
                    document.getElementById('axleDistance').value = data.axleDistance
                    document.getElementById('axleDistanceInBoogieInput').value = data.axleDistanceInBoogie
                    document.getElementById('axleCountInput').value = data.axleCount
                    document.getElementById('godslengthInput').value = data.godsLenght
                    document.getElementById("searchInput").value = ""
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
        `AXLE DISTANCE: ${profile.axleDistance}\n`,
        `AXLE DISTANCE IN BOOGIE: ${profile.axleDistanceInBoogie}\n`,
        `AXLE COUNT: ${profile.axleCount}\n`,
        `GODSLENGHT: ${profile.godsLenght}\n`)

    return stringBuilder.join(``)
}

/**
 * Checks for empty input fields in first section
 */
function checkForEmptyInput() {
    if (document.getElementById('utNumberInput').value.trim() == "") throw "UT inputfelt ikke udfyldt"
    if (document.getElementById('datoInput').value.trim() == "") throw "Dato inputfelt ikke udfyldt"
    if (document.getElementById('godsartInput').value.trim() == "") throw "Godsart inputfelt ikke udfyldt"
    if (document.getElementById('vognlitraInput').value.trim() == "") throw "Vognlitra inputfelt ikke udfyldt"
    if (document.getElementById('godslengthInput').value.trim() == "") throw "Godslængde inputfelt ikke udfyldt"
    if (document.getElementById('axleDistance').value.trim() == "") throw "Akseldistance inputfelt ikke udfyldt"
    if (document.getElementById('axleDistanceInBoogieInput').value.trim() == "") throw "Akseldistance mellem boogierne inputfelt ikke udfyldt"
    if (document.getElementById('axleCountInput').value.trim() == "") throw "Aksel antal inputfelt ikke udfyldt"
}

















