import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { profileHeader, userInfoHeader } from './component-utils'
import TrackTable from './TrackTable'

type DashProps = {
    status: string;
}

type ObjType = {
    [key:string]: any
}

type ProfileTypes = {
    profile_pic: string;
    name: string;
    top_artist_img: string[];
    top_tracks: ObjType;
}

const Dashboard = ({status}:DashProps) => {
    const [profileData, setProfileData] = useState<ProfileTypes>({
        profile_pic: '',
        name: '',
        top_artist_img: [],
        top_tracks: {}
    });

    const getTracksFilter = ((filter: React.MouseEvent<HTMLButtonElement>) => {
        // Target returns the reference to the element that triggered the event.
        // Note this is different from currentEvent
        // We also need to type filter.target as HTMLButtonElement as .target returns the EventTarget interface
        let filter_range = (filter.target as HTMLButtonElement).value;
        axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${filter_range}&limit=10`, {
            headers: userInfoHeader(status)
        }).then(response => {
            setProfileData({
                ...profileData,
                top_tracks: response.data
            });
        });
    })

    useEffect(() => {
        const getUserData = axios.get('https://api.spotify.com/v1/me', {headers: profileHeader(status)});
        const getUserArtists = axios.get('https://api.spotify.com/v1/me/top/artists?limit=3',{
            headers: userInfoHeader(status)
        });
        const getUserTracks = axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10',{
            headers: userInfoHeader(status)
        });

        axios.all([getUserData, getUserArtists, getUserTracks])
        .then(axios.spread<ObjType, void>((user, artists, tracks) => {
                //console.log(tracks.data);
                setProfileData({
                    profile_pic: user.data.images[0].url,
                    name: user.data.display_name,
                    top_artist_img: artists.data.items.map((artist: ObjType) => {
                        return artist.images[1].url;
                    }),
                    // top_tracks: tracks.data.items.map((tracks: ObjType) => {
                    //     return tracks.album.images[1].url;
                    // })
                    top_tracks: tracks.data
                });
            })
        );
    }, [status]);
    return (
       <div className = "dashboard">
            <img 
                src = {profileData.profile_pic} 
                alt = "usr_img"
                className = "user_pfp">
            </img>

            <div className = "track-filters">
                <button 
                value = "short_term"
                className = "filter-buttons"
                onClick = {getTracksFilter}>Top Tracks (4 weeks)
                </button>

                <button 
                value = "medium_term"
                className = "filter-buttons"
                onClick = {getTracksFilter}>Top Tracks (6 months)
                </button>

                <button
                value = "long_term"
                className = "filter-buttons"
                onClick = {getTracksFilter}>Top Tracks (All time)
                </button>

            </div>
            <TrackTable filter = {profileData.top_tracks} />
            {/* <h2>Here's your top Artists:</h2>
            {profileData.top_artist_img.map((img, index) => {
                return <img key = {index} src = {img}></img>
            })}  */}
            {/* <h2>Here's your top Tracks:</h2>
            {profileData.top_tracks.map((img, index) => {
                return <img key = {index} src = {img}></img>
            })}  */}
       </div>
   )
}

export default Dashboard;