import { createContext, useContext, useEffect, useState } from "react";
import { BACKEND_SERVER_TOKEN } from "../utils/Constants";
import { CLIENT_ID } from "../utils/Constants";

export const AuthContext = createContext(null);

function getAccessToken(code) {

    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpresIn] = useState();

    useEffect(() => {
        
        let codeVerifier = localStorage.getItem('code_verifier');
        fetch(BACKEND_SERVER_TOKEN, {
            method: 'POST', 
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({
                code: code, 
                codeVerifier: codeVerifier
            })

        })
        .then(res => res.json())
        .then(data => {
            setAccessToken(data.access_token);
            window.history.pushState({}, null, "/");
        })
        .catch(err => {
            console.error(err);
        })
    }, [code])

    return accessToken;
}

const handleLogin = async () => {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem('code_verifier', verifier);

    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("response_type", "code");
    params.append("redirect_uri", 'http://localhost:5173/');
    params.append("scope", "playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;

}

function generateCodeVerifier(length) {
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

const logout = () => {
    window.location.href = '/'
}

export function AuthContextProvider({ children }) {
    
    return (
        <AuthContext.Provider
            value={{
                handleLogin, 
                getAccessToken,
                logout

            }}
        >
            { children }
        </AuthContext.Provider>
    )
}

export function useAuthContext() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuthContext must be used within an AuthContextProvider"
        )
    }
    return context;
}