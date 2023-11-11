import {Button, Spinner} from "@chakra-ui/react";

export default function PlaylistFooter({ creatingPlaylist, createPlaylist, changeBPM, loading }) {


    return (
        <div id='playlistFooter'>
            <div id='playlistButtons'>

                <Button size='md' onClick={createPlaylist} bg='purple' colorScheme='white' variant='solid' isDisabled={loading || creatingPlaylist}>
                    {!creatingPlaylist ? <> Create Playlist </> : <Spinner />}
                </Button>

                <Button size='md' onClick={changeBPM}>
                    Change BPM
                </Button>
            </div>

        </div>
    )
}