/////////////////////////////////////////////////////
///////////////// HTTP HELP METHODS /////////////////

/**
 * @param {String} url of API 
 * @param {Object} data 
 * @returns created profile to the API and DB
 */
 async function post(url, data) {
    const respons = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
    if (respons.status !== 201 && respons.status !== 200) throw new Error(respons.status)
    return await respons.json()
}

/**
* @param {String} url of API
* @returns The Json object from the HTTP call.
*/
async function get(url) {
    const respons = await fetch(url)
    if (respons.status !== 200) throw new Error(respons.status)
    return await respons.json()
}

/////////////////////////////////////////////////////