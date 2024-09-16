const express = require('express')
const pool = require('../modules/pool')
const router = express.Router()

// all recipes route

router.get('/all', (req, res) => {
    // turn into a try/catch block later? 
    const queryText = `SELECT * FROM "momsrecipes";`    

    pool.query(queryText).then((result) => {
        console.log(`/api/recipes/all success`)
        res.send(result.rows)
    }).catch((error) => {
        console.log(`/api/recipes/all ERROR`, error)
        res.sendStatus(500)
    })
})

module.exports = router