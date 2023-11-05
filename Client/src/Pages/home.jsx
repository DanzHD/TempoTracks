import { useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";

import { 
	Flex,
	Heading, 
	Text, 
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
import '../styles/app.css'

export default function Home({ code }) {
    
    const { getAccessToken, logout } = useAuthContext();
    const [stage, setStage] = useState(1);
    const [BPM, setBPM] = useState(0);
    getAccessToken(code);
    
    return (
        <>
            {stage === 1 && <Stage1 logout={logout} setStage={setStage} stage={stage} setBPM={setBPM} />} 
            
            {stage === 2 && <Stage2 logout={logout} stage={stage} setStage={setStage} BPM={BPM} />}
            
        </>
    )
}

export function Stage1({ logout, stage, setStage, setBPM}) {

    const handleStageUpdate = (e) => {
        e.preventDefault();
        setStage( stage + 1);
        setBPM(e.target.BPM.value);

    }

    return (
        <div className="stage1PageLayout">
            <Stack className="textStyling" spacing={24}>
                <Flex bg='rgb(54, 184, 100)' height='75px' justifyContent='space-between' padding='20px'>
                    <div></div>
                    <div className="stage">
                        <div className="whiteCircle">1</div>
                        <div>Select BPM</div>
                    </div>
                    
                    <Button onClick={logout} id="logout">Logout</Button>
                </Flex>

                <Flex flexDirection='column' justifyContent='center' alignItems='center' gap='20px'>
                    <Heading id="headingStyling">Enter Tempo</Heading>

                    <Center>

                        <form onSubmit={handleStageUpdate}>
                            <Flex flexDirection="column" gap='20px'>

                                <FormControl isRequired>

                                    <NumberInput width='lg' min={1} >
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

            <div class="custom-shape-divider-bottom-1699175355">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
                </svg>
            </div>
        </div>

        
    )
    
}

export function Stage2({ logout, stage, setStage, BPM}) {
    const { FindSongs, getUserID, createPlaylist, addPlaylist } = useAPIContext();
    let trackURI = FindSongs(BPM);
    
    
    const handleClick = () => {
        getUserID().then(async (userID) => {
            const trackURIs = await trackURI;
            const playlistID = await createPlaylist({ userID });
            addPlaylist({ trackURIs, playlistID })


        });
    }


    
    return (
        <>
    
            <Stack spacing={24}>
                <Flex bg='rgb(54, 184, 100)' height='75px' justifyContent='space-between' padding='20px'>
                    <Heading fontSize='3xl'>Gym-Music</Heading>
                    <Text>Step 2 (Placeholder)</Text>
                    <Text onClick={logout} id="logout">Logout</Text>
                </Flex>

                <Flex flexDirection='column' justifyContent='center' alignItems='center' gap='20px'>
                    <Heading>Playlist</Heading>

                </Flex>
            </Stack>

            <Button onClick={() => setStage(1)} />
            <Button onClick={handleClick} />

            
        </>

    )

}