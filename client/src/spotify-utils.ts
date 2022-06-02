/* This file is used for the various API calls to Spotify */
import axios from 'axios'
import queryString from 'query-string'

export const getAccessToken = () => {
  const parsed_url = queryString.parse(window.location.hash);
  return parsed_url.access_token;
}

export const token = getAccessToken()

export const profileHeader = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/x-www-form-urlencoded',
};

export const userInfoHeader = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// Grab user's profile data, extracting pfp's, etc.
export const getUserData = () => axios.get('https://api.spotify.com/v1/me', {
  headers: profileHeader,
});

export const getUserArtists = () => axios.get('https://api.spotify.com/v1/me/top/artists?limit=3', 
  {
    headers: userInfoHeader,
  }
);

export const getTopTracksShort = () => axios.get(
  `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term`,
  {
    headers: userInfoHeader,
  }
);

export const getTopTracksMedium = () => axios.get(
  `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term`,
  {
    headers: userInfoHeader,
  }
);

export const getTopTracksLong = () => axios.get(
  `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term`,
  {
    headers: userInfoHeader,
  }
);

