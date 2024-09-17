const express = require('express')
const pool = require('../modules/pool')
const router = express.Router()

// all tags route
router.get('/all', (req, res) => {

    const queryText = `SELECT * FROM "moms_tags";`    

    pool.query(queryText).then((result) => {
        console.log(`/api/tags/all success`)
        res.send(result.rows)
    }).catch((error) => {
        console.log(`/api/tags/all ERROR`, error)
        res.sendStatus(500)
    })
})

module.exports = router