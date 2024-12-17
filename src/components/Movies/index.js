import React, { useState, useEffect } from "react";
import axios from "axios";
import { load } from "cheerio";
import "./Movies.css";
import CustomNav from "../CustomNav";
import { Container } from "reactstrap";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    const options = {
      method: "POST",
      url: "https://http-cors-proxy.p.rapidapi.com/",
      headers: {
        "x-rapidapi-key": "7cfd5c7a86msh9bb0d440cd13288p1436e4jsnee71829833d2",
        "x-rapidapi-host": "http-cors-proxy.p.rapidapi.com",
        "Content-Type": "application/json",
        Origin: "www.example.com",
        "X-Requested-With": "www.example.com",
      },
      data: {
        url: "https://www.imdb.com/calendar/", // IMDb Calendar URL
      },
    };

    try {
      const response = await axios.request(options);
      const html = response.data;
      const $ = load(html);
      const movieData = [];

      // Extract the JSON content from the script tag
      const scriptContent = $("#__NEXT_DATA__").html();
      const jsonData = JSON.parse(scriptContent);

      // Traverse JSON to get movies
      const groups = jsonData.props.pageProps.groups;

      groups.forEach((group) => {
        const releaseDate = group.group; // "Dec 20, 2024"
        group.entries.forEach((entry) => {
          const title = entry.titleText;
          const poster =
            entry.imageModel?.url || "https://via.placeholder.com/150";
          const genres = entry.genres ? entry.genres.join(", ") : "Unknown";
          const release = new Date(entry.releaseDate).toDateString();

          movieData.push({
            title,
            releaseDate: releaseDate || release,
            image: poster,
            genres,
          });
        });
      });

      console.log("Movies:", movieData);
      setMovies(movieData);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <CustomNav />
      <div className="movies-container">
        <h1 className="movies-heading">Upcoming Movie Releases</h1>

        {loading ? (
          <p className="loading">Loading movies...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : movies.length === 0 ? (
          <p className="no-movies">No movies found.</p>
        ) : (
          <div className="movie-list">
            {movies.map((movie, index) => (
              <div key={index} className="movie-item">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="movie-poster"
                />
                <h2 className="movie-title">{movie.title}</h2>
                <p className="movie-release-date">
                  Release Date: {movie.releaseDate}
                </p>
                <p className="movie-genres">Genres: {movie.genres}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Movies;
