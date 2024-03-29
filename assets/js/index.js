import { sidebar } from "./sidebar.js"
import { apiKey, imageBaseUrl, fetchData } from "./api.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

// fetch all genres and change their format to {"1" : "Action"}

// create genre string from ids to names
// object
const genreList = {
    asString(genreIdList) {
        let newGenreList = [];

        for (const genreId of genreIdList) {
            // this == genreList
            this[genreId] && newGenreList.push(this[genreId]);
        }
        return newGenreList.join(", ");
    }
};
    
fetchData(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en`,
    ({genres}) => {
    for (const {id, name} of genres) {
        genreList[id] = name;
    }

    fetchData(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1`, heroBanner);

});



// load them in the banner
const heroBanner = ({results: movieList}) => {
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.ariaLabel = "Popular Movies";
    banner.innerHTML = `
            <div class="banner-slider"></div>
            
            <div class="slider-control">
                <div class="control-inner"></div>
            </div>
    `;

    let controlItemIndex = 0;

    for (const [index, movie] of movieList.entries()) {
        const { 
            backdrop_path, 
            title,
            release_date,
            genre_ids,
            overview,
            poster_path,
            vote_average,
            id
        } = movie;

        const sliderItem = document.createElement("div");
        sliderItem.classList.add("slider-item");
        sliderItem.setAttribute("slider-item", "");
        sliderItem.innerHTML = `
            <img src="${imageBaseUrl}w1280${backdrop_path}" alt="${title}" class="img-cover" loading=${index === 0 ? "eager" : "lazy"}>
            <div class="banner-content">
                <h2 class="heading">${title}</h2>
                <div class="meta-list">
                    <div class="meta-item">${release_date.split("-")[0]}</div>
                    <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
                </div>
                <p class="genre">${genreList.asString(genre_ids)}</p>
                <p class="banner-text">${overview}</p>
                <a href="./detail.html" class="btn">
                    <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
                    <span class="span">Watch now</span>
                </a>
            </div>
        `;

        banner.querySelector(".banner-slider").appendChild(sliderItem);

        const controlItem = document.createElement("button");
        controlItem.classList.add("poster-box", "slider-item");
        controlItem.setAttribute("slider-control", `${controlItemIndex}`);

        controlItemIndex++;

        controlItem.innerHTML = `
            <img src="${imageBaseUrl}w154${poster_path}" alt="${title}" loading="lazy" draggable="false" class="img-cover">
        `;
    }
}