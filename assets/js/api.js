import { key } from "../../options.js";

const apiKey = key;
const imageBaseUrl = "https://image.tmdb.org/t/p/"

const fetchData = function(url, callback, optionalParam) {
    //const response = await fetch(url);
    //const data = await response.json();
    //await callback(data, optionalParam);
    fetch(url)
          .then(response => response.json())
          .then(data => callback(data, optionalParam));
}

export { imageBaseUrl, apiKey, fetchData }