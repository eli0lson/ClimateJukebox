# Climate Jukebox

A web app that works with your Spotify profile to create a playlist to reflect the weather in your location, including only songs in your library. 

## Work in Progress

- Conversion of [existing project](https://github.com/eli0lson/WeatherPlaylist) from Django/Python to React

-----

## <ins>To Do</ins>
- [x] Spotify API Calls
- [ ] Weather API
- [ ] Spotify Authorization
- [ ] Styling
- [ ] One-time user location access

## Nice to have at some point
- User-feedback-based learning

----

## <ins>To run</ins> (NPM expected to be installed)
- Clone Repo
- Get OAuth token with scopes user-library-read, playlist-modify-public, playlist-modify-private from [Spotify API](https://developer.spotify.com/console/get-track/)
- Edit `src/spotify-info.js` to include this token and your Spotify username
- Within ClimateJukebox directory, execute the command `npm run start`