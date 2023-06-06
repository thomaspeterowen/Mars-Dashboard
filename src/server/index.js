require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
//const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
//const proxy = 'http://195.233.9.60:8080';
//const proxyAgent = new HttpsProxyAgent(proxy);

// NASA pic gallery from specific rover (Curiosity/Opportunity/Spirit)
app.get('/rovers/:name', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.name}/latest_photos?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

// NASA mars rover manifest info
app.get('/rovers/manifest/:name', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${req.params.name}/?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))