import { useAuthContext } from '../Contexts/AuthContext'
import '../styles/App.css'
import { 
	Button
} from '@chakra-ui/react'
import Footer from "../Components/Footer.jsx";

function App() {

	const { handleLogin } = useAuthContext()

	return (
    	<>
			<div className='landingPage' >

				<div id='intro'>

						<h1 className='intro-heading'>Create personalized playlists of your favourite tracks automatically.</h1>
						<h3 id='intro-text'>Personalize. Create. Jam </h3>
						<Button marginTop='min(50px, 30%)' w='max(200px, 1em)' bg='#112035' colorScheme='' onClick={handleLogin}>Login with Spotify →</Button>

				</div>
			</div>

			<div id='explanation'>

				<div>How It Works</div>

				<div id='steps'>
					<div className='step'>
						<div className='stepHeading'>
							<div className='whiteCircle'>1</div>
							<div>Choose a BPM</div>
						</div>

						<div className='stepExplanation'>
							Select the track tempo of songs you want in your new playlist.
						</div>
					</div>

					<div className='step'>
						<div className='stepHeading'>

							<div className='whiteCircle'>2</div>
							<div>Review the tracks</div>
						</div>

							<div className='stepExplanation'>
								We'll find tracks within your liked songs and playlists that matches
								the selected BPM within 5 beats, then you can choose what to keep.
							</div>
					</div>

					<div className='step'>
						<div className='stepHeading'>

							<div className='whiteCircle'>3</div>
							<div>Save to Spotify</div>
						</div>

						<div className='stepExplanation'>
							Choose a name for the playlist, and once you're ready, 
							save the playlist to Spotify. 
						</div>
					</div>
				</div>
				
			</div>
			
			<Footer />
    	</>
	)
}

export default App
