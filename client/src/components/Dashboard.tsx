import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  getUserData,
  getUserArtists,
  getTopTracksShort,
  getTopTracksMedium,
  getTopTracksLong,
} from '../spotify-utils';
import TrackTable from './TrackTable';

type ObjType = {
  [key: string]: any;
};

type ProfileTypes = {
  profile_pic: string;
  name: string;
  top_artist_img: string[];
  current_filter?: string;
  top_tracks: ObjType;
  track_offset: number;
  limit: number;
};

function Dashboard() {
  const [profileData, setProfileData] = useState<ProfileTypes>({
    profile_pic: '',
    name: '',
    top_artist_img: [],
    current_filter: 'long_term',
    top_tracks: {},
    track_offset: 0,
    limit: 0,
  });

  const filters = {
    long: getTopTracksLong(),
    medium: getTopTracksMedium(),
    short: getTopTracksShort(),
  };

  const changeFilter = async (filter: string) => {
    const { data } = await filters[filter as keyof typeof filters];
    setProfileData((current) => ({
      ...current,
      top_tracks: data,
      current_filter: filter,
    }));
  };

  const showMore = () => {
    setProfileData((current) => ({
      ...current,
      track_offset: current.track_offset + 10,
    }));
  };

  useEffect(() => {
    const getInitialData = async () => {
      const [user, artists, tracks] = await axios.all([
        getUserData(),
        getUserArtists(),
        getTopTracksLong(),
      ]);
      setProfileData({
        profile_pic: user.data.images[0].url,
        name: user.data.display_name,
        top_artist_img: artists.data.items.map(
          (artist: ObjType) => artist.images[1].url
        ),
        // top_tracks: tracks.data.items.map((tracks: ObjType) => {
        //     return tracks.album.images[1].url;
        // })
        top_tracks: tracks.data,
        track_offset: 10,
        limit: 50,
      });
    };
    getInitialData();
  }, []);

  return (
    <div className="dashboard">
      <img src={profileData.profile_pic} alt="usr_img" className="user_pfp" />

      <div className="track-filters">
        <button
          type="button"
          className="filter-buttons"
          onClick={() => changeFilter('short')}
        >
          Top Tracks (4 weeks)
        </button>

        <button
          type="button"
          className="filter-buttons"
          onClick={() => changeFilter('medium')}
        >
          Top Tracks (6 months)
        </button>

        <button
          type="button"
          className="filter-buttons"
          onClick={() => changeFilter('long')}
        >
          Top Tracks (All time)
        </button>
      </div>
      <TrackTable
        filter={profileData.top_tracks}
        limit={profileData.track_offset}
      />
      {profileData.track_offset < profileData.limit && (
        <button type="button" onClick={() => showMore()}>
          Load more songs
        </button>
      )}

      {/* <h2>Here's your top Artists:</h2>
            {profileData.top_artist_img.map((img, index) => {
                return <img key = {index} src = {img}></img>
            })}  */}
      {/* <h2>Here's your top Tracks:</h2>
            {profileData.top_tracks.map((img, index) => {
                return <img key = {index} src = {img}></img>
            })}  */}
    </div>
  );
}

export default Dashboard;
