import {useEffect, useMemo, useState} from "react";
import { useAuthContext } from "../Contexts/AuthContext";

import {
    Flex,
    Heading,
    Stack,
    Button,
    Center,
    FormControl,
    NumberInput,
    NumberInputField,
    NumberIncrementStepper,
    NumberDecrementStepper,
    NumberInputStepper


} from '@chakra-ui/react'

import { useAPIContext } from "../Contexts/APIContext";
import '../styles/App.css'
import Navbar from "../Components/Nav.jsx";
import LoadingBar from "../Components/loadingBar.jsx";
import Banner from "../Components/Banner.jsx";
import PlaylistFooter from "../Components/PlaylistFooter.jsx";
import App from "./App.jsx";

export default function Home({ code }) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    
    const { getAccessToken } = useAuthContext();
    const [stage, setStage] = useState(1);
    const [BPM, setBPM] = useState(0);
    getAccessToken({code, setAccessToken});

    if (!accessToken) {
        return <App />
    } else {

        return (
            <>
                {stage === 1 && <Stage1 setStage={setStage} stage={stage} setBPM={setBPM}/>}

                {stage === 2 && <Stage2 stage={stage} setStage={setStage} BPM={BPM}/>}

                {stage === 3 && <Stage3 setStage={setStage}/>}

            </>
        )
    }
}

export function Stage1({ setStage, setBPM }) {

    const handleStageUpdate = (e) => {
        e.preventDefault();

        setStage(2);
        setBPM(e.target.BPM.value);
    }

    const preventMinus = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    }

    const preventPasteNegative = (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData('text');

        if (pastedData.includes('-')) {
            e.preventDefault();
        }
    }

    return (
        <div className="stage1PageLayout">
            <Stack className="textStyling" spacing={24}>
                <Navbar stage='1' backgroundColor='rgb(54, 184, 100)' stageDescription='Enter Tempo' />

                <Flex flexDirection='column' justifyContent='center' alignItems='center' gap='20px'>
                    <Heading id="headingStyling">Enter Tempo</Heading>

                    <Center>

                        <form onSubmit={handleStageUpdate}>
                            <Flex flexDirection="column" gap='20px'>
                                <FormControl>
                                    <NumberInput width='lg' min={1} onKeyDown={preventMinus} onPaste={preventPasteNegative} isRequired>
                                        <NumberInputField name="BPM" />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>

                                        
                                </FormControl>

                                    <Center>
                                        <Button 
                                        type="submit" 
                                        size='lg' 
                                        colorScheme="" 
                                        backgroundColor='#2C5282'
                                        > 
                                            Create New Playlist 
                                        </Button>
                                    </Center>

                            </Flex>
                        </form>
                        
                    </Center>
                </Flex>
            </Stack>
            <div className='wave'>

                <div className="custom-shape-divider-bottom-1699175355">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                    </svg>
                </div>
            </div>
        </div>

        
    )
    
}

export function Stage2({ setStage, BPM }) {
    const { FindSongs, getUserID, createPlaylist, addPlaylist, getNumberOfTracks, getTrackInfo } = useAPIContext();
    const [songsAnalysed, setSongsAnalysed] = useState(null);
    const [numberTracks, setNumberTracks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tracks, setTracks] = useState([])
    const [creatingPlaylist, setCreatingPlaylist] = useState(false);

    useMemo(() => {
        setLoading(true);
        (async function() {
            setNumberTracks(await getNumberOfTracks())
        })()
        setLoading(false);
    }, [BPM])


    useEffect(() => {
        (async function() {
            setLoading(true);
            let trackInfo;
            setSongsAnalysed(songsAnalysed => 0);

            for (let i = 0; i < Math.ceil(numberTracks / 50); i++) {

                trackInfo = await getTrackInfo(50 * i);
                let newTracks = await FindSongs({ BPM, trackInfo, tracks, setTracks});

                setTracks(tracks => [...tracks, ...newTracks])
                setSongsAnalysed(songsAnalysed => songsAnalysed + trackInfo.length);

            }
            setLoading(false);
        })();

    }, [numberTracks]);

    const handleClick = () => {
        getUserID().then(async (userID) => {
            setCreatingPlaylist(creatingPlaylist => true);

            let trackURIs = tracks.filter(track => selectedTracks.includes(track.ID)).map(track => track.uri);
            const playlistID = await createPlaylist({ userID });
            addPlaylist({ trackURIs, playlistID })

            setCreatingPlaylist(false);
            setStage(3);
        });
    }

    const handleChangeBPM = () => {
        setStage(1);
    }

    const [selectedTracks, setSelectedTracks] = useState([]);
    useEffect(() => {
        const selectedTrackIDs = tracks.map(track => track.ID);
        setSelectedTracks(selectedTrackIDs);
    }, [tracks])

    const trackItems = tracks.map(track =>
            <Banner key={track.ID} name={track.name}
                    artists={track.artist}
                    image={track.images}
                    uri={track.uri}
                    setSelectedTracks={setSelectedTracks}
                    selectedTracks={selectedTracks}
                    ID={track.ID}
            >
            </Banner>
    )

    if (numberTracks !== null) {
        return (
            <>
                <div id='stage2PageLayout'>
                    <div className="textStyling">
                        <Navbar stage='2' backgroundColor='rgb(54, 184, 100)' stageDescription='Edit Playlist'/>

                        <LoadingBar text={`${songsAnalysed} / ${numberTracks} Tracks Analysed`}
                                    progress={songsAnalysed / numberTracks * 100} color='green'/>

                    </div>


                    <section id='songs'>
                        <Heading style={{marginBottom: '30px'}}>
                            Songs
                        </Heading>

                        <Flex flexDirection='column' gap='20px'>

                            {trackItems}


                        </Flex>

                    </section>

                </div>

                <PlaylistFooter creatingPlaylist={creatingPlaylist} createPlaylist={handleClick} changeBPM={handleChangeBPM} loading={loading}/>

                <div className='wave'>


                    <div className="custom-shape-divider-bottom-1699175355">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
                             preserveAspectRatio="none">
                            <path
                                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                                className="shape-fill"></path>
                        </svg>
                    </div>
                </div>

            </>

        )
    } else {
        return <div>loading...</div>
    }
}

export function Stage3({ setStage }) {

    const handleClick = () => {
        setStage(1);
    }

    return (
        <>
            <div className="stage3PageLayout">
                <Stack className="textStyling" spacing={24}>
                    <Navbar stage='3' backgroundColor='rgb(54, 184, 100)' stageDescription='Play on Spotify' />

                    <Flex flexDirection='column' justifyContent='center' alignItems='center'>

                        <Heading>Playlist has now been created!</Heading>
                        <Button onClick={handleClick}>Create another playlist</Button>
                    </Flex>

                </Stack>
                <div className='wave'>

                    <div className="custom-shape-divider-bottom-1699175355">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </>
    )

}