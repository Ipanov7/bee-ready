const cloudant = require('cloudant')

function connectToDb(){
    const conn = cloudant({url: process.env.DB_URL})
    return conn.db.use(process.env.DB_NAME)
}

function jobExists(job){
    const db = connectToDb()
    return new Promise((resolve, reject) => {
        db.get(job.id, (err) => {
            if (err) {
                if (err.message == 'missing') {
                    resolve(false);
                } else {
                    console.error(`[${new Date()}] Error occurred: ${err.message}`, 'findById()');
                    reject(err);
                }
            } else {
                resolve(true);
            }
        });
    });
}

function addJob(job_found) {
    const db = connectToDb();
    let job = {
        _id: job_found.id,
        id: job_found.id,
        title: job_found.title,
        url: job_found.url,
        created: Date.now()
    }
    db.insert(job, (err, result) => {
        if (err) {
            console.error(`[${new Date()}] Error occurred: ${err.message}`, 'create()');
        } else {
            console.log(`[${new Date()}] New Job #${job.id} created`, 'create()')
        }
    });
}

module.exports = {
    jobExists: jobExists,
    addJob: addJob,
}