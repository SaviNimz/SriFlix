import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../utils/firebase-config";
import Card from "../components/Card";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { getUsersLikedMovies } from "../store";
import { useDispatch, useSelector } from "react-redux";

export default function UserListedMovies() {
  // Redux hooks to access dispatch function and state
  const movies = useSelector((state) => state.netflix.movies);
  const dispatch = useDispatch();

  // useNavigate hook to navigate programmatically
  const navigate = useNavigate();

  // Local state for managing scroll status and user email
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

  // Helper function to filter movies based on their type (optional, can be used later)
  const moviesOfType = (type) => {
    return movies.filter((movie) => movie.type === type);
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="content flex column">
        <h1>Your Favourite Movies and TV Series</h1>
        <div className="grid flex">
          {movies && movies.length > 0 ? (
            movies.map((movie, index) => (
              <Card
                movieData={movie}
                index={index}
                key={movie.id}
                isLiked={true}
              />
            ))
          ) : (
            <p>No movies found</p>
          )}
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
