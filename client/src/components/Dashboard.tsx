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
    current_filter: string;
    top_tracks: ObjType;
    track_offset: number;
}

const Dashboard = ({status}:DashProps) => {
    const [profileData, setProfileData] = useState<ProfileTypes>({
        profile_pic: '',
        name: '',
        top_artist_img: [],
        current_filter: '',
        top_tracks: {},
        track_offset: 0
    });

    const getTracksFilter = () => {
        // Target returns the reference to the element that triggered the event.
        // Note this is different from currentEvent
        // We also need to type filter.target as HTMLButtonElement as .target returns the EventTarget interface
        axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${profileData.current_filter}&limit=${profileData.track_offset}`, {
            headers: userInfoHeader(status)
        }).then(response => {
            setProfileData({
                ...profileData,
                top_tracks: response.data
            });
        });
    };

    const handleFilter = (filter? : string, offset? : number) => {
        setProfileData(prevState => ({
            ...prevState,
            current_filter: (filter) ? filter : prevState.current_filter,
            track_offset: (offset) ? prevState.track_offset + offset : 10
        }));
    }


    useEffect(() => {
        const getUserData = axios.get('https://api.spotify.com/v1/me', {headers: profileHeader(status)});
        const getUserArtists = axios.get('https://api.spotify.com/v1/me/top/artists?limit=3',{
            headers: userInfoHeader(status)
        });
        const getUserTracks = axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10&offset=9`, {
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
                    current_filter: 'long-term',
                    track_offset: 10,
                    // top_tracks: tracks.data.items.map((tracks: ObjType) => {
                    //     return tracks.album.images[1].url;
                    // })
                    top_tracks: tracks.data
                });
            })
        );
    }, [status]);

    useEffect(() => {
        getTracksFilter();
    }, [profileData.current_filter, profileData.track_offset])


    return (
       <div className = "dashboard">
            <img 
                src = {profileData.profile_pic} 
                alt = "usr_img"
                className = "user_pfp">
            </img>

            <div className = "track-filters">
                <button 
                className = "filter-buttons"
                onClick = {() => handleFilter("short_term")}>Top Tracks (4 weeks)
                </button>

                <button 
                className = "filter-buttons"
                onClick = {() => handleFilter("medium_term")}>Top Tracks (6 months)
                </button>

                <button
                className = "filter-buttons"
                onClick = {() => handleFilter("long_term")}>Top Tracks (All time)
                </button>

            </div>
            <TrackTable filter = {profileData.top_tracks} />
            <button onClick = {() => handleFilter(undefined, 10)}>Load more songs</button>
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