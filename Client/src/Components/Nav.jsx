import {Button, Flex} from "@chakra-ui/react";
import {useAuthContext} from "../Contexts/AuthContext.jsx";

export default function Navbar({ backgroundColor, stage, stageDescription }) {
    const { logout } = useAuthContext();
    return (
        <>
            <Flex bg={backgroundColor} height='75px' justifyContent='space-between' padding='20px'>
                <div></div>
                <div className="stage">
                    <div className="whiteCircle">{stage}</div>
                    <div>{stageDescription}</div>
                </div>

                <Button onClick={logout} id="logout">Logout</Button>
            </Flex>
        </>
    )
}