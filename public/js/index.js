function getProfile() {
    const profile = {
        utNumber: 2,
        dato: '10/11-2021',
        godsType: 'Godstype',
        vognLitra: 'Vognlitra',
        axleDistance: 200.52,
        axleDistanceInBoogie: 200,
        axelCount: 200
    }
    return profile
}

const tegnButton = document.getElementById('tegnBtn');

async function post(url, data) {
    const respons = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
    if (respons.status !== 201 && respons.status !== 200) throw new Error(respons.status)
    return await respons.json()
  }

async function submit() {
    try {
        const profile = getProfile()
        let url = '/api/profiles'
        await post(url, profile)
        window.location.assign(`/`)
    } catch (error) {
        console.log(error.message)
    }
}

tegnButton.onclick = submit;


