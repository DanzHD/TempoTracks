import './styles/App.css'
import { 
	Flex,
	Heading, 
	Text, 
	Stack, 
	Button
} from '@chakra-ui/react'
import { CLIENT_ID } from "../utils/Constants";

import theme from '../styles/theme'


function App() {

	const handleLogin = async () => {
		const verifier = generateCodeVerifier(128);
		const challenge = await generateCodeChallenge(verifier);

		const params = new URLSearchParams();
		params.append("client_id", CLIENT_ID);
		params.append("response_type", "code");
		params.append("redirect_uri", 'http://localhost:5173/');
		params.append("scope", "playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative");
		params.append("code_challenge_method", "S256");
		params.append("code_challenge", challenge);
		console.log(`https://accounts.spotify.com/authorize?${params.toString()}`);
		window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;

		return;
	}

	function generateCodeVerifier(Length) {
		let text = '';
		let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	async function generateCodeChallenge(codeVerifier) {
		const data = new TextEncoder().encode(codeVerifier);
		const digest = await window.crypto.subtle.digest('SHA-256', data);
		return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
	}



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
