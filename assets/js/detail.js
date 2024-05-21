import { apiKey, imageBaseUrl, fetchData } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";

// Details page
const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

await sidebar();

const getGenres = function(genreList) {
    const newGenreList = [];

    for(const {name} of genreList) {
        newGenreList.push(name);
    }

    return newGenreList.join(", ");
}

const getCasts = function(castList) {
    const newCastList = [];

    for (let i = 0, len = castList.length; i < len && i < 10; i++) {
        const { name } = castList[i];
        newCastList.push(name);
    }

    return newCastList.join(", ");
}

const getDirectors = function(staffList) {
    const directors = staffList.filter(({job}) => job === "Director");

    const directorList = [];

    for(const {name} of directors) {
        directorList.push(name);
    }

    return directorList.join(", ");
}

// Returns only trailers and teasers as array
const filterVideos = function(videoList) {
    return videoList.filter(({type, site}) => (type === "Trailer" || type === "Teaser") && site === "YouTube");
}

await fetchData(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=casts,videos,images,releases`,
function (movie) {
    // object destructuring or destructuring assignment
    const {
        backdrop_path, 
        title,
        release_date,
        runtime,
        poster_path,
        vote_average,
        releases: { 
            countries: [{ certification }] 
        },
        genres,
        overview,
        casts: { 
            cast, 
            crew 
        },
        videos: { 
            results: videos 
        }
    } = movie;

    document.title = `${title} - MovieSpree`;

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");
    movieDetail.innerHTML = `
    <div class="backdrop-image" style="background-image: 
        url('${imageBaseUrl}${"w1280" || "original"}${backdrop_path || poster_path}');">
    </div>
    <figure class="poster-box movie-poster">
        <img src="${imageBaseUrl}w342${poster_path}" alt="${title} poster" class="img-cover">
    </figure>
    <div class="detail-box">
        <div class="detail-content">
            <h1 class="heading">${title}</h1>
            <div class="meta-list">

                <div class="meta-item">
                    <img src="./assets/images/star.png" width="20" height="20" alt="rating">
                    <span class="span">${vote_average.toFixed(1)}</span>
                </div>

                <div class="separator"></div>

                <div class="meta-item">${runtime}</div>

                <div class="separator"></div>

                <div class="meta-item">${release_date.split("-")[0]}</div>

                <div class="meta-item card-badge">${certification}</div>
            </div>
            <p class="genre">${getGenres(genres)}</p>
            <p class="overview">${overview}</p>

            <ul class="detail-list">
                <div class="list-item">
                    <p class="list-name">Starring</p>
                    <p>${getCasts(cast)}</p>
                </div>
                <div class="list-item">
                    <p class="list-name">Directed by</p>
                    <p>${getDirectors(crew)}</p>
                </div>
            </ul>
        </div>

        <div class="title-wrapper">
            <h3 class="title-large">Trailers and Clips</h3>
        </div>

        <div class="slider-list">
            <div class="slider-inner"></div>
        </div>
    </div>
    `;

    for (const {key, name} of filterVideos(videos)) {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");
        videoCard.innerHTML = `
            <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?theme=dark&color=white&rel=0"
            frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
        `;

        movieDetail.querySelector(".slider-inner").appendChild(videoCard);
    }

    pageContent.appendChild(movieDetail);

    // Fetch recommended movies
    fetchData(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&page=1`,
        addSuggestedMovies);
});


const addSuggestedMovies = function({results: movieList}, title) {
    const movieListEl = document.createElement("section");
    movieListEl.classList.add("movie-list");
    movieListEl.ariaLabel = "You May Also Like";

    movieListEl.innerHTML = `
    <div class="title-wrapper">
        <h3 class="title-large">You May Also Like</h3>
    </div>

    <div class="slider-list">
        <div class="slider-inner"></div>
    </div>
    `;

    for (const movie of movieList) {
        const movieCard = createMovieCard(movie); // called from movie_card.js

        movieListEl.querySelector(".slider-inner").appendChild(movieCard);
    }

    pageContent.appendChild(movieListEl);
}