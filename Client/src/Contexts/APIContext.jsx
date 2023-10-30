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

        const getTrackIDs = async (offset) => {

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
            .then(tracks => tracks.map(track => track.track.id))
            .catch(err => {
                console.log(err)
            })
            
            
            
        }

        const getTracks = async (trackIDs) => {
 
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            trackIDs.then(async (trackIDs) => {
                for (let i = 0; i < trackIDs.length; i++) {
                    let trackID = trackIDs[i]
                    fetch(`https://api.spotify.com/v1/audio-analysis/${trackID}`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded', 
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.track.tempo <= (BPM + 10) && (data.track.tempo) >= (BPM - 10)) {
                            tracks.push(trackID);
                        }
                    })
                    await delay(600)
                }

            });


        }
        let numberTracks = getNumberOfTracks();
        
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        numberTracks.then(async (numberTracks) => {
            let trackIDs = null;
            for (let i = 0; i < Math.ceil(numberTracks / 50); i++) {
                trackIDs = getTrackIDs(50 * i);
                getTracks(trackIDs);
                await delay(2000)

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


}


export function APIContextProvider({ children }) {
    
    
    
    

    return <APIContext.Provider 
            value={{
                FindSongs,
                getUserID,
                createPlaylist
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