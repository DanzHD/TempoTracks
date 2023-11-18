import { createContext, useContext } from "react";
import { BACKEND_SERVER } from "../utils/Constants.jsx";

export const APIContext = createContext(null);

const getNumberOfTracks = async () => {
    const accessToken = localStorage.getItem('accessToken')
    const options = {
        method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`
        }
    }

    return await fetch("https://api.spotify.com/v1/me/tracks", options)
        .then(res => res.json())
        .then(data => data.total);
}

const getTrackInfo = async (offset) => {
    const accessToken = localStorage.getItem('accessToken')
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`
        }
    }

    return await fetch(`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`, options)
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
            uri: track.uri,
        }
    });


    const body = JSON.stringify({
        accessToken: accessToken,
        tracks: tracks,
        BPM: BPM
    })
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }
    return fetch(`${BACKEND_SERVER}/tracks/audio-features`, options)
        .then(res => res.json())


}

const getUserID = () => {
    const accessToken = localStorage.getItem('accessToken');
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`
        }
    }

    return fetch("https://api.spotify.com/v1/me", options)
        .then(res => res.json())
        .then(data => data.id);

}

const createPlaylist = async ({ userID }) => {

    const accessToken = localStorage.getItem('accessToken');
    let playlistID;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accessToken: accessToken,
            userID: userID
        })
    }
    playlistID = await fetch(`${BACKEND_SERVER}/playlist`, options)
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

    fetch(`${BACKEND_SERVER}/playlist/add`, options)
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