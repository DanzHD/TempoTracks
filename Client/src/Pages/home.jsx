import { useEffect } from "react";
import { useAuthContext } from "../Contexts/AuthContext";

export default function Home({ code }) {
    
    const { getAccessToken } = useAuthContext();
    
    return (
    <>
        Hi
    </>
    )
}
