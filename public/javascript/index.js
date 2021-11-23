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
    var myForm = document.getElementById('form')
    var textInputs = myForm.querySelectorAll('input[type=text]')
    for (var i in textInputs) {
        console.log(textInputs[i].id)
        if (textInputs[i].id != undefined && textInputs[i].value.trim() == "") throw "Udfyld venligst alle inputfelter"
        //if (textInputs[i].value != undefined && i != 0 && textInputs[i].value.trim() == "") throw "Udfyld venligst alle inputfelter"
    }
}

function clearInputFields() {
    var myDiv = document.getElementById('test')
    var textInputs = myDiv.querySelectorAll('input[type=text]')
    for (var i in textInputs) {
        textInputs[i].value = ""
        document.getElementById('utNumberInput').readOnly = false
        document.getElementById('clearBtn').style.display = "none"
        document.getElementById('deleteBtn').style.display = "none"
    }
}
clearBtn.onclick = clearInputFields

















