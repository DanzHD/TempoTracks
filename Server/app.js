const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();


const PORT = process.env.PORT || 5001

app.get("/", (req, res) => {
    res.send("Test")
})
app.listen(PORT, (err) => {
    
    console.log(`Server is running on port ${PORT}`);
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


    fetch("https://accounts.spotify.com/api/token", {
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

app.post("/playlist", (req, res) => {
    const { accessToken, userID } = req.body;
    const options = {
        method: "POST",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            name: "TempoTracks Playlist",
            public: 'false'
        })
    }
    
    fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,options)
    .then(response => {
        if (!response.ok) {
            res.status(response.status)
            throw new Error('HTTP status ' + response.status);
        }

        return response.json();
    })
    .then(data => {
        return res.json(data);
    })
    .catch(err => {
        console.error(err);
    })

})

app.post("/playlist/add", (req, res) => {
    const { accessToken, trackURIs, playlistID } = req.body;

    const body = JSON.stringify({
        uris: trackURIs
    })

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${accessToken}`,
        },
        body: body
    }


    fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, options)
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

app.post("/tracks/audio-features", (req, res) => {

    const { accessToken, tracks, BPM } = req.body;
    const trackIds = tracks.map(track => track.ID).toString();
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`
        }
    }

    fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, options)
    .then(res => res.json())
    .then(data => {
        const t = data['audio_features'].filter(track => parseInt(track.tempo) <= parseInt(BPM) + 10 && parseInt(track.tempo) >= parseInt(BPM) - 10);
        let newTracks = tracks.filter(track => t.some(newTrack => newTrack.id === track.ID))
        return res.send(newTracks);
    })
})
