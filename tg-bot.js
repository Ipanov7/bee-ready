const request = require('request');

const base_url=`https://api.telegram.org/bot${process.env.TG_API_KEY}/`

function sendMessage(payload){
    return new Promise(function (resolve, reject) {
        request.post(base_url + 'sendMessage', {
            json: {
                chat_id: process.env.TG_CHAT_ID,
                text: payload,
            }
        }, (error, res) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                resolve(res)
            }
        })
    })
}

async function sendJobOpenings(jobs) {
    console.log(`[${new Date()}] Sending ${jobs.length} job notifications`)
    let greetings = 'Hi Loris, bee ready for new opportunities! Bzz \u{1F41D}'
    await sendMessage(greetings)
    for (job of jobs) {
        let opening = `${job.title} #${job.id} - ${job.url}`
        await sendMessage(opening)
    }
}

module.exports = {
    sendJobOpenings: sendJobOpenings,
}