export default function LoadingBar({ progress, color, text }) {
    return (
    <>
        <div className='loadingBar'>
            <div className='progress' style={{width: `${progress}%`, backgroundColor: `${color}`, height: "100%"}}>

            </div>
            {text && <div className='progressText'> {text} </div>}
        </div>
    </>
    )

}