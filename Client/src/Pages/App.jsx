import { useAuthContext } from '../Contexts/AuthContext'
import '../styles/App.css'
import { 
	Flex,
	Heading, 
	Text, 
	Stack, 
	Button
} from '@chakra-ui/react'





function App() {

	const { handleLogin } = useAuthContext()

	return (
    	<>
			<Stack spacing={24}>
				<Flex bg='rgb(54, 184, 100)' height='75px' justifyContent='space-around' padding='20px'>
					<Heading fontSize='3xl'>Gym-Music</Heading>
					<Text></Text>
				</Flex>

				<Flex flexDirection='column' justifyContent='center' alignItems='center' gap='20px'>
					<Heading>Create your own personalized Spotify Gym Playlist automatically</Heading>
					<Text fontSize='xl'>Gym-Music creates a personalized playlist based off your Spotify playlists and liked songs</Text>
					<Button size='lg' bg='rgb(54, 184, 100) ' colorScheme='' onClick={handleLogin}>Login with Spotify →</Button>
				</Flex>
			</Stack>

    	</>
	)
}

export default App
