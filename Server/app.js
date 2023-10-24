const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();


app.listen(3000, (err) => {
    
    console.log(`Server is running on port ${process.env.API_PORT}`);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.post('/api/login', (req, res) => {
    let body = new URLSearchParams({
        grant_type: 'authorization_code', 
        code: req.body.code, 
        redirect_uri: process.env.WEB_LINK, 
        client_id: process.env.CLIENT_ID, 
        code_verifier: req.body.codeVerifier
    });


    fetch(process.env.SPOTIFY_TOKEN_LINK, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
        
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
        }
        
        return response.json();
    })
    .then(data => {
        return res.json(data);
        
    })
    .catch(err => {
        console.error('Error:', err);
    });


})