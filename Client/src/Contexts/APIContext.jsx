import { Children, createContext, useContext, useEffect } from "react";
import { useAuthContext } from "./AuthContext";

export const APIContext = createContext(null);

async function FindSongs(BPM) {

    const { accessToken } = useAuthContext();
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
            
            
            
        }

        const getTracks = async (trackIDs) => {
            trackIDs.then(trackIDs => {
                trackIDs.forEach(trackID => {
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

                })

            });


        }
        let numberTracks = getNumberOfTracks();
        numberTracks.then(numberTracks => {
            let trackIDs = null;
            for (let i = 0; i < Math.ceil(numberTracks / 50); i++ ) {
                trackIDs = getTrackIDs(50 * i);
                getTracks(trackIDs);
            }
            
        })


    }, [BPM])

    
    return tracks;

}



export function APIContextProvider({ children }) {

    return <APIContext.Provider 
            value={{
                FindSongs
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