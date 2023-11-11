import {Checkbox} from "@chakra-ui/react";

export default function Banner({ name, image, artists, uri, setSelectedTracks, selectedTracks, ID}) {



    function handleCheckBoxChange(e) {
        if (!e.target.checked) {
            setSelectedTracks(selectedTracks => selectedTracks.filter(trackID => trackID !== ID));
        } else {
            setSelectedTracks(selectedTracks => [...selectedTracks, ID]);
        }

    }



    return (
        <>
            <div className='song' style={!selectedTracks.includes(ID) ? {backgroundColor: 'white', opacity: 0.3} : {}}>
                <Checkbox onChange={handleCheckBoxChange} style={{opacity: 1}} marginRight='20px' defaultChecked></Checkbox>
                <img src={image[2].url} alt='Song'/>
                <div key={uri} className='songInfo'>
                    <div >
                        <b> {name} </b>
                    </div>

                    <div>

                        {
                            artists.map(artist => {

                                return <div key={artist.id}>{artist.name} </div>
                            })

                        }
                    </div>
                </div>
            </div>
        </>
    )
}