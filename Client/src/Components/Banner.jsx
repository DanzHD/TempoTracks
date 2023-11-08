export default function Banner({ name, image, artists, uri}) {

    return (
        <>
            <div className='song'>
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