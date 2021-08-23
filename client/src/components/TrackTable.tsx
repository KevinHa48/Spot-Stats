import React, { useRef, useEffect } from 'react'

type TrackType = {
    [key:string]: any
}

const TrackTable = ({filter}: TrackType) => {
    // 'items' are objects, gonna have to get more creative here.
    console.log(filter);

    const previewRef = useRef<HTMLTableSectionElement>(null);

    const updatePreview = () => {
        // This is so ugly but this works LOL
        if (previewRef.current) {
            let arr = Array.from(previewRef.current.children);
            arr.slice(1).forEach(element => 
                (element.children[1].children[0] as HTMLAudioElement).load());
        }
    }

    useEffect(() => {
        updatePreview();
    },[filter])

    return (
        <table className = "top-tr-tb">
            <tbody ref = {previewRef}>
               
                {(filter.items) ?
                 filter.items.map((entry : TrackType, index : number) => {
                    return (
                        <tr className = "entry" key = {index}>
                            <td width = "65%">
                                <img 
                                className = "album-cover"
                                src = {entry.album.images[1].url}
                                alt = "cover-fallbacks">
                                </img>

                                <p className = "song-name">{entry.name}</p>
                                <p className = "artist">{entry.artists[0].name}</p>
                            
                            </td>

                            <td>
                                <audio controls>
                                    <source
                                    key = {index} 
                                    src = {entry.preview_url}
                                    type = "audio/mpeg">
                                    </source>
                                </audio>
                            </td>
                        </tr>
                    )
                }): null}
                
            </tbody>
        </table>
    );
};

export default TrackTable;