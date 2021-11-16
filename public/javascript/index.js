const tegnButton = document.getElementById('submitBtn');

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
        console.log(profile)
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

















