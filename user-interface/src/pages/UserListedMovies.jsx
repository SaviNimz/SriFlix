import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../utils/firebase-config";
import Card from "../components/Card";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { getUsersLikedMovies } from "../store";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function UserListedMovies() {
  // Redux hooks to access dispatch function and state
  const movies = useSelector((state) => state.netflix.movies);
  const dispatch = useDispatch();

  // useNavigate hook to navigate programmatically
  const navigate = useNavigate();

  // Local state for managing scroll status, user email, and backend status
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState(undefined);

  // Firebase authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email);
      } else {
        navigate("/login");
      }
    });
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [navigate]);

  // Fetch user's liked movies when email is available
  useEffect(() => {
    if (email) {
      dispatch(getUsersLikedMovies(email));
    }
  }, [email, dispatch]);

  // Scroll event listener to manage navbar state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset !== 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if backend is online
  const checkBackendStatus = async () => {
    try {
      await axios.get("http://localhost:5000/status");
      return true;
    } catch (error) {
      return false;
    }
  };

  // Function to render movies
  const renderMovies = () => {
    const backendStatus = checkBackendStatus();
    if (backendStatus) {
      return movies && movies.length > 0 ? (
        movies.map((movie, index) => (
          <Card
            movieData={movie}
            index={index}
            key={movie.id}
            isLiked={true}
          />
        ))
      ) : null; // Return null if no movies found
    } else {
      return <p>Backend offline</p>;
    }
  }

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="content flex column">
        <h1>Your Favourite Movies and TV Series</h1>
        <div className="grid flex">
          {renderMovies()}
        </div>
      </div>
    </Container>
  );
}

// Styled-component for Container
const Container = styled.div`
  .content {
    margin: 2.3rem;
    margin-top: 8rem;
    gap: 3rem;

    h1 {
      margin-left: 3rem;
    }

    .grid {
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
`;
