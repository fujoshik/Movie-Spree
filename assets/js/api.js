import { key } from "../../options.js";

const apiKey = key;
const imageBaseUrl = "https://image.tmdb.org/t/p/"

const fetchData = function(url, callback, optionalParam) {
    fetch(url)
          .then(response => response.json())
          .then(data => callback(data, optionalParam));
}

export { imageBaseUrl, apiKey, fetchData }