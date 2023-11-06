import {createContext, useContext, useEffect} from "react";

export const APIContext = createContext(null);

const getNumberOfTracks = async () => {
    const accessToken = localStorage.getItem('accessToken')

    return await fetch("https://api.spotify.com/v1/me/tracks",
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(res => res.json())
        .then(data => data.total);
}

const getTrackInfo = async (offset) => {
    const accessToken = localStorage.getItem('accessToken')

    return await fetch(`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(res => res.json())
        .then(data => data.items)
        .then(tracks => tracks.map(track => track.track))
        .catch(err => {
            console.log(err)
        })

}


const FindSongs = async (BPM, trackInfo, songsAnalysed, setSongsAnalysed) => {

    const accessToken = localStorage.getItem('accessToken');
    const tracks = []

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < trackInfo.length; i++) {
        let track = trackInfo[i]
        fetch(`https://api.spotify.com/v1/audio-analysis/${track.id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if ((parseInt(BPM) + 10 >= parseInt(data.track.tempo)) && (parseInt(data.track.tempo) >= parseInt(BPM) - 10)) {
                tracks.push(track.uri);
            }
        })
        setSongsAnalysed(songsAnalysed => songsAnalysed + 1);
        await delay(600)
    }

    return tracks;

}

const getUserID = () => {
    const accessToken = localStorage.getItem('accessToken');

    return fetch("https://api.spotify.com/v1/me",
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(res => res.json())
        .then(data => data.id);

}

const createPlaylist = async ({ userID }) => {

    const accessToken = localStorage.getItem('accessToken');

    let playlistID;
    playlistID = await fetch('http://localhost:3000/playlist', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accessToken: accessToken,
            userID: userID
        })
    })
        .then(res => res.json())
        .then(data => data.id)
        .catch(err => console.log(err));

    
    return playlistID;
}

const addPlaylist = async ({ trackURIs, playlistID }) => {
    const accessToken = localStorage.getItem('accessToken');
    const body = JSON.stringify({
        trackURIs: trackURIs,
        playlistID: playlistID,
        accessToken: accessToken
    })

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }

    fetch('http://localhost:3000/playlist/add', options)
    .catch(err => console.error(err));
}




export function APIContextProvider({ children }) {
    
    return <APIContext.Provider 
            value={{
                FindSongs,
                getUserID,
                createPlaylist,
                addPlaylist,
                getNumberOfTracks,
                getTrackInfo
            }}
        >
        { children }
    </APIContext.Provider>
}

export function useAPIContext() {
    const context = useContext(APIContext);
    if (!context) {
        throw new Error('APIContext must be used within APIContextProvider ')
    }

    return context;
}