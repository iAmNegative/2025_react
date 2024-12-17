import React, { useState, useEffect } from "react";
import axios from "axios";
import { load } from "cheerio"; // Using cheerio to parse the page's HTML
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

    try {
      // Directly fetch IMDb's calendar page
      const response = await axios.get("https://www.imdb.com/calendar/", {
        headers: {
          "Accept": "text/html", // Accept HTML content
        }
      });

      const html = response.data;
      const $ = load(html); // Load HTML into cheerio

      // Initialize an empty array to store the movies
      const movieData = [];

      // Extract the JSON content from the script tag with id "__NEXT_DATA__"
      const scriptContent = $("#__NEXT_DATA__").html();
      const jsonData = JSON.parse(scriptContent);

      // Traverse JSON to get movie entries
      const groups = jsonData.props.pageProps.groups;

      groups.forEach((group) => {
        const releaseDate = group.group; // Release date group (e.g., "Dec 20, 2024")
        group.entries.forEach((entry) => {
          const title = entry.titleText; // Movie title
          const poster = entry.imageModel?.url || "https://via.placeholder.com/150"; // Poster URL
          const genres = entry.genres.join(", "); // Join genres in a string
          const release = new Date(entry.releaseDate).toDateString(); // Release date formatted

          movieData.push({
            title,
            releaseDate: releaseDate || release,
            image: poster,
            genres,
          });
        });
      });

      setMovies(movieData); // Set the movies state with the data

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
