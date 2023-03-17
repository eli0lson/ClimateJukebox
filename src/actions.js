import { token, userId } from './spotify-info';

const URL = "https://api.spotify.com/v1";

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
};

export const createPlaylist = async () => {

  const body = {
    name: "Your playlist",
    description: "Some songs to fit this day. It is a day",
    public: false
  };

  let response = await fetch(`${URL}/users/${userId}/playlists`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers
  });

  response = await response.json()

  console.log("BEEPBOP", response);

  const playlistLink = response.external_urls.spotify;
  const { id: playlistId } = response;

  const librarySize = await getLibrarySize();
  const songList = await getSongsFromLibrary(librarySize);
  await populatePlaylist(playlistId, songList);

  let finalResponse = await fetch(`${URL}/playlists/${playlistId}`, {
    headers
  })

  finalResponse = await finalResponse.json()

  console.log(finalResponse)

  return { playlistLink, playlistId, images: finalResponse.images }
}

const getLibrarySize = async () => {

  let response = await fetch(`${URL}/me/tracks?limit=1`, {
    headers
  });

  response = await response.json()

  return response?.total
}

const getSongsFromLibrary = async (librarySize, selectionSize = 15) => {
  let songs = [];
  let used = [];

  let i = 0;

  while (songs.length < selectionSize) {
    let offset = Math.floor(Math.random() * (librarySize - 1));
    while (used.includes(offset)) {
      offset = Math.floor(Math.random() * (librarySize - 1));
    }
    used.push(offset);

    let songResponse = await fetch(`${URL}/me/tracks?limit=1&offset=${offset}`, {
      headers
    });

    console.log(i)
    
    songResponse = await songResponse.json();

    const results = songResponse.items;
    const songURI = results[0].track.uri;

    // const songFeaturesResponse = await fetch(`${URL}/audio-features/${songId}`, {
    //   headers
    // });

    //TODO check if the song fits the weather

    songs.push(songURI);
    i++
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