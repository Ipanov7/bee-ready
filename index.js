const request = require('request');
const db = require('./db')
const tg = require('./tg-bot')
const schedule = require('node-schedule');
const dotenv = require('dotenv');
const express = require('express')
const app = express()

console.log(`[${new Date()}] Starting service...`)

const BASE_URL = 'https://jobs.netflix.com'
const URI= '/api/search?location=Amsterdam%2C%20Netherlands~Berlin%2C%20Germany~London%2C%20United%20Kingdom~Madrid%2C%20Spain~Paris%2C%20France~Kaer%20Morhen&team=Core%20Engineering'
const new_jobs = []

dotenv.config();

let rule = new schedule.RecurrenceRule()
rule.hour = 8
rule.minute = 0
rule.second = 0

schedule.scheduleJob(rule, checkNewOpenings)
app.listen(8080)


function checkNewOpenings() {
    console.log(`[${new Date()}] Checking new openings at ${BASE_URL}`)
    request(BASE_URL + URI, async function (err, res, body) {
        if(err) {
            console.error(`[${new Date()}] Error occurred while requesting ${BASE_URL+URI}`);
        } else {
            let data = JSON.parse(body)
            let jobs = data.records.postings
            for (job of jobs) {
                job_summary = {
                    title: job.text,
                    id: job.external_id,
                    url: job.url,
                }
                let exists = await db.jobExists(job_summary)
                if (!exists){
                    console.log(`[${new Date()}] New job found - Job ID #${job_summary.id}`);
                    new_jobs.push(job_summary)
                    db.addJob(job_summary)
                }
            }
            if (new_jobs.length > 0) {
                tg.sendJobOpenings(new_jobs)
            }
        }
    });
}