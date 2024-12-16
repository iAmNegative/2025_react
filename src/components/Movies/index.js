import React, { useState, useEffect } from "react";
import axios from "axios";
import { load } from "cheerio";
import "./Movies.css";
import CustomNav from "../CustomNav";
import { Container } from "reactstrap";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, [currentMonth]);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    const options = {
      method: 'POST',
      url: 'https://http-cors-proxy.p.rapidapi.com/',
      headers: {
        'x-rapidapi-key': '7cfd5c7a86msh9bb0d440cd13288p1436e4jsnee71829833d2',
        'x-rapidapi-host': 'http-cors-proxy.p.rapidapi.com',
        'Content-Type': 'application/json',
        Origin: 'www.example.com',
        'X-Requested-With': 'www.example.com'
      },
      data: {
        url: `https://www.filmjabber.com/movie-release-dates/2025/${currentMonth}/`
      }
    };

    try {
      const response = await axios.request(options);
      const html = response.data;
      const $ = load(html);
      const movieData = [];

      let currentReleaseDate = "";
      $("#content")
        .find("h2, .table_row")
        .each((_, element) => {
          const tag = $(element).prop("tagName");

          if (tag === "H2") {
            currentReleaseDate = $(element).text().trim();
          } else if ($(element).hasClass("table_row")) {
            const title = $(element).find(".index_link a").text().trim();
            const poster =
              $(element).find(".movie_poster img").attr("src") ||
              "https://via.placeholder.com/150";

            if (title) {
              movieData.push({
                title,
                releaseDate: currentReleaseDate,
                image: poster.startsWith("http")
                  ? poster
                  : `https://www.filmjabber.com${poster}`,
              });
            }
          }
        });

      setMovies(movieData);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth > 1) {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth < 12) {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <Container>
      <CustomNav />
      <div className="movies-container">
        <div className="month-selector">
          <label>Select Month: </label>
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
          >
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>
        </div>

        <div className="navigation-buttons">
          <button onClick={handlePrevMonth} disabled={currentMonth === 1}>
            Back
          </button>
          <button onClick={handleNextMonth} disabled={currentMonth === 12}>
            Next
          </button>
        </div>

        {loading ? (
          <p className="loading">Loading movies...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : movies.length === 0 ? (
          <p className="no-movies">No movies found for the selected month.</p>
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
                <p className="movie-release-date">Release Date: {movie.releaseDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Movies;
