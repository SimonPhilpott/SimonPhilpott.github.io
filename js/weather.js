/*async function getWeatherAW(woeid) {
    try {
        let result = await fetch(`http://www.metaweather.com/api/location/${woeid}`, {
            mode: 'no-cors'
        });
        let data = await result.json();
        console.log(`Temperatures in ${ data.title } stay between ${ today.min_temp } and ${ today.max_temp }`)
    } catch (error) {
        console.log(error);
    }
}
getWeatherAW(44418);*/