// Check if song is energetic and good for dancing
const isSunny = (weatherReport, temp) => {
    const valence = weatherReport.valence;
    const danceability = weatherReport.danceability;

    if (temp >= 25) {
        return valence > 0.5 && danceability < 0.5;
    } else if (temp >= 9) {
        return valence > 0.5 && danceability >= 0.5;
    } else {
        return valence > 0.35 && danceability <= 0.6;
    }
}

// Check if song is slower, but not horribly sad
const isCloudy = (weatherReport, temp) => {
    const valence = weatherReport.valence;
    const danceability = weatherReport.danceability;

    if (temp >= 25) {
        return valence < 0.5 && danceability < 0.5;
    } else if (temp >= 9) {
        return valence < 0.5 && danceability >= 0.5;
    } else {
        return valence < 0.5 && danceability < 0.3;
    }
}

// Check that song is low energy, not meant to boost anyone's mood
const isRainy = (weatherReport, temp) => {
    const valence = weatherReport.valence;
    const energy = weatherReport.energy;

    return valence < 0.4 && energy < 0.4;
}

export { isSunny, isCloudy, isRainy };