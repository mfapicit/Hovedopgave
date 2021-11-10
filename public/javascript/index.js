const tegnButton = document.getElementById('tegnBtn');

/**
 * Method to save the values of the profile
 * @returns {Object} Values to create a new profile 
 */
function getProfile() {
    const profile = {
        utNumber: 3,
        dato: '10/11-2021',
        godsType: 'Godstype',
        vognLitra: 'Vognlitra',
        axleDistance: 200.52,
        axleDistanceInBoogie: 200,
        axelCount: 200
    }
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
        const profile = getProfile()
        await findByUT(profile.utNumber).then(data => {
            foundUTNumber = data.utNumber
        })
        if (foundUTNumber === profile.utNumber) {
            alert("FEJL!\n\nProfilens UT nummer eksiterer allerede i databasen")
        } else {
        var accept = confirm("Vil du oprette den nye profil")
        if(accept == true) {
        let url = '/api/profiles'
        await post(url, profile)
        window.location.assign(`/`)
        }
    }
    } catch (error) {
        console.log(error)
    }
}

tegnButton.onclick = submit;


