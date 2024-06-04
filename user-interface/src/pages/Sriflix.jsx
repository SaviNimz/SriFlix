import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, getGenres } from "../store";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import backgroundImage from "../assets/poster 2.jpg";

const Sriflix = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);

  // Set scroll event to manage the navbar style based on the scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset !== 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch genres on component mount
  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  // Fetch movies once genres are loaded
  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: "all" }));
    }
  }, [genresLoaded, genres, dispatch]);

  // Navigate to the player page when the Play button is clicked
  const handlePlayClick = () => {
    navigate("/player");
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="hero">
        <img src={backgroundImage} alt="background" className="background-image" />
        <div className="content">
          <div className="buttons">
            <button onClick={handlePlayClick} className="button">
              <FaPlay />
              Play
            </button>
            <button className="button">
              <AiOutlineInfoCircle />
              More Info
            </button>
          </div>
        </div>
      </div>
      <Slider movies={movies} />
    </Container>
  );
};

// Styled components for consistent styling
const Container = styled.div`
  background-color: black;
  .hero {
    position: relative;
    .background-image {
      filter: brightness(60%);
      width: 100vw;
      height: 110vh;
    }
    .content {
      position: absolute;
      bottom: 5rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 5rem;
      .buttons {
        display: flex;
        gap: 2rem;
        .button {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          gap: 1rem;
          border-radius: 0.2rem;
          padding: 0.5rem 2rem;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s ease-in-out;
          &:hover {
            opacity: 0.8;
          }
          &:nth-of-type(2) {
            background-color: rgba(109, 109, 110, 0.7);
            color: white;
            svg {
              font-size: 1.8rem;
            }
          }
        }
      }
    }
  }
`;

export default Sriflix;
