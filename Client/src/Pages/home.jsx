import { useEffect, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";

import { 
	Flex,
	Heading, 
	Text, 
	Stack, 
	Button,
    Input,
    InputGroup,
    InputLeftElement,
    Center,
    FormControl,
    NumberInput,
    NumberInputField,
    NumberIncrementStepper,
    NumberDecrementStepper,
    NumberInputStepper
    
    
} from '@chakra-ui/react'

import { useAPIContext } from "../Contexts/APIContext";

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
    
        <Stack spacing={24}>
            <Flex bg='rgb(54, 184, 100)' height='75px' justifyContent='space-between' padding='20px'>
                <Heading fontSize='3xl'>Gym-Music</Heading>
                <Text>Step 1 (Placeholder)</Text>
                <Text onClick={logout} id="logout">Logout</Text>
            </Flex>

            <Flex flexDirection='column' justifyContent='center' alignItems='center' gap='20px'>
                <Heading>Enter the beats per minute range</Heading>

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