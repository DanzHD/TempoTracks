import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Pages/App.jsx'
import Home from './Pages/home.jsx'
import './styles/index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthContextProvider } from './Contexts/AuthContext.jsx'
const code = new URLSearchParams(window.location.search).get("code");


ReactDOM.createRoot(document.getElementById('root')).render(
	

	
	<ChakraProvider>
		<AuthContextProvider>
			{ !code ? <App /> : <Home code={code}/> }
		</AuthContextProvider>
	</ChakraProvider>
	

)

