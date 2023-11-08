import {Button} from "@chakra-ui/react";

export default function PlaylistFooter({ createPlaylist, changeBPM }) {

    return (
        <div id='playlistFooter'>
            <div id='playlistButtons'>

                <Button onClick={createPlaylist} bg='purple' colorScheme='white' variant='solid'>
                    Create Playlist
                </Button>

                <Button onClick={changeBPM}>
                    Change BPM
                </Button>
            </div>

        </div>
    )
}