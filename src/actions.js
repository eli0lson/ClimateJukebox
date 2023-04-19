import { token, userId } from './spotify-info';
import { weatherApiKey } from './weatherbit-info';
import { isSunny, isCloudy, isRainy } from './weatherFilters';

const URL = "https://api.spotify.com/v1";
const WEATHER_BIT_URL = " https://api.weatherbit.io/v2.0/current";

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
};

export const createPlaylist = async (weatherCode, temp, city) => {

  let weatherString = '';
  let weatherFilter;

  switch(true) {
    case weatherCode > 751 && weatherCode < 804:
      weatherString = "Sunny";
      weatherFilter = isSunny;
      break;
    case weatherCode < 621:
      weatherString = "Rainy";
      weatherFilter = isCloudy;
      break;
    default:
      weatherString = "Cloudy";
      weatherFilter = isRainy;
  }

  const body = {
    name: `A ${weatherString} Day in ${city}`,
    description: '' + `Some songs to fit this ${weatherString} day. It is ${temp} degrees`,
    public: false
  };

  let response = await fetch(`${URL}/users/${userId}/playlists`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers
  });

  response = await response.json();

  const playlistLink = response.external_urls.spotify;
  const { id: playlistId } = response;

  const librarySize = await getLibrarySize();
  const songList = await getSongsFromLibrary(librarySize, weatherFilter, temp);
  await populatePlaylist(playlistId, songList);

  let finalResponse = await fetch(`${URL}/playlists/${playlistId}`, {
    headers
  })

  finalResponse = await finalResponse.json()

  return { playlistLink, playlistId, images: finalResponse.images }
}

const getLibrarySize = async () => {

  let response = await fetch(`${URL}/me/tracks?limit=1`, {
    headers
  });

  response = await response.json()

  return response?.total
}

const getSongsFromLibrary = async (librarySize, weatherFilter, temp, selectionSize = 15) => {
  let songs = [];
  let used = [];

  let i = 0;

  while (i < selectionSize) {
    console.log(i)

    let offset = Math.floor(Math.random() * (librarySize - 1));
    while (used.includes(offset)) {
      offset = Math.floor(Math.random() * (librarySize - 1));
    }
    used.push(offset);

    let songResponse = await fetch(`${URL}/me/tracks?limit=1&offset=${offset}`, {
      headers
    });
    
    songResponse = await songResponse.json();

    const results = songResponse.items;
    const songURI = results[0].track.uri;
    const songId = results[0].track.id;

    const songFeaturesResponse = await fetch(`${URL}/audio-features/${songId}`, {
      headers
    });

    const printed = await songFeaturesResponse.json();


    // check if the song fits the weather''
    const keep = weatherFilter(printed, temp);
    if (keep) {
      songs.push(songURI);
      i++
    }
  }

  return songs;
};

const populatePlaylist = async (playlistId, songIds) => {
  
  console.log(songIds)
  let response = await fetch(`${URL}/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: JSON.stringify(songIds),
    headers
  });

  response = await response.json()

  return response?.snapshot_id;
}

export const getWeather = async (city, stateInput, country) => {
  let stateVal = '';

  if (stateInput.length > 0) {
    const valList = stateInput.split(' ')
    if (valList.length > 1) {
      stateVal = valList[0] + '+' + valList[1];
    } else {
      stateVal = valList[0];
    }
  }

  city = stateVal.length > 0 ? city + `,${stateVal}` : city

  const searchParams = new URLSearchParams()
  searchParams.append('city', city);
  if (country.length > 0) searchParams.append('country', country);
  searchParams.append('key', weatherApiKey);

  // let urlExtraBit = `?city=${city}` +
  //   (stateVal.length > 0 ? `,${stateVal}` : '') + 
  //   (country.length > 0 ? `&country=${country}` : '');
  // urlExtraBit = urlExtraBit + `&key=${weatherApiKey}`;
  let response = await fetch(`${WEATHER_BIT_URL}?${searchParams}`);

  return response.json()
}