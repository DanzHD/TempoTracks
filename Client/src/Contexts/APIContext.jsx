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


const FindSongs = async ({ BPM, trackInfo }) => {

    const accessToken = localStorage.getItem('accessToken');

    const tracks = trackInfo.map(track => {
        return {
            ID: track.id,
            images: track.album.images,
            name: track.name,
            artist: track.artists,
            uri: track.uri
        }
    });


    const body = JSON.stringify({
        accessToken: accessToken,
        tracks: tracks,
        BPM: BPM
    })

    return fetch(`http://localhost:3000/tracks/audio-features`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then(res => res.json())





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