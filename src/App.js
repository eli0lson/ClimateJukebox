import React, { useState } from 'react';

import './App.css';
import LocationForm from './location-form';

import { createPlaylist, getWeather } from './actions';

function App() {

  const [link, setLink] = useState('');

  const [image, setImage] = useState({});

  // const handleClick = async () => {
  //   const playlistStuff = await createPlaylist();
  //   console.log(playlistStuff)
  //   const { playlistLink, images } = playlistStuff;
  //   setLink(playlistLink);
  //   setImage(images[1]);
  // }

  const getWeatherAtLocation = async (city, state, country) => {
    setLink('')
    setImage({})
    const { data } = await getWeather(city, state, country);
    const weatherResponse = data[0]
    const weatherCode = weatherResponse.weather.code;
    const temp = weatherResponse.temp;

    const playlistStuff = await createPlaylist(weatherCode, temp, city);
    console.log(playlistStuff)
    const { playlistLink, images } = playlistStuff;
    setLink(playlistLink);
    setImage(images[1]);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          make a random playlist :)
        </p>
      </header>
      <div className="locationForm" >
        <LocationForm getLocation={getWeatherAtLocation} />
      </div>
      <div className="app-body">
        {/* {link.length === 0 &&
        <div>
          <button
            className="App-link"
            href="#"
            onClick={() => handleClick()}
          >
            ok here we go
          </button>
        </div>
        } */}
        {link?.length > 0 &&
          <div>
            <div className="App-link">
              <a 
                className="App-link"
                href={link} 
                target='_blank' 
                rel="noreferrer">
                  click here to go to the playlist
              </a>
            </div>
            <div>
              <img src={image?.url} height={image?.height} width={image?.width} alt='playlist-cover'></img>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
