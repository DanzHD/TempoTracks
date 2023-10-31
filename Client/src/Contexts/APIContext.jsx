import { Children, createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";

export const APIContext = createContext(null);

async function FindSongs(BPM) {

    const accessToken = localStorage.getItem('accessToken');
    const tracks = []
    
    
    useEffect(() => {

        const getNumberOfTracks = async () => {
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

        const getTracks = async (trackInfo) => {
 
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            trackInfo.then(async (trackInfo) => {
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
                            console.log("test");
                            tracks.push(track.uri);
                        }
                    })
                    await delay(600)
                }

            });


        }
        let numberTracks = getNumberOfTracks();
        
        numberTracks.then(async (numberTracks) => {
            let trackInfo = null;
            for (let i = 0; i < Math.ceil(numberTracks / 50); i++) {
                trackInfo = getTrackInfo(50 * i);
                getTracks(trackInfo);


            }
            
        })


    }, [BPM])

    
    return tracks;

}

const getUserID = () => {
    const accessToken = localStorage.getItem('accessToken');

    const userID = fetch("https://api.spotify.com/v1/me", 
    {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(res => res.json())
    .then(data => data.id)
    

    return userID;

}

const createPlaylist = async ({ userID }) => {

    const accessToken = localStorage.getItem('accessToken');
    
    const playlistID = await fetch('http://localhost:3000/playlist', {
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
                addPlaylist
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