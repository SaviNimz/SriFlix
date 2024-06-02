import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Effect to handle authentication state changes
  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      
      // Redirect if user is logged in
      if (currentUser) navigate("/");
    });
    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, [navigate]);

  // Function to handle login
  const handleLogin = async () => {
    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      toast.success("Login successful!");
    } catch (err) {
      // Set error message if login fails
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Container>
      <BackgroundImage />
      <Content>
        <Header />
        <FormContainer>
          <Form>
            <Title>
              <h3>Login</h3>
            </Title>
            <InputContainer>
              {/* Input fields for email and password */}
              <Input
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {/* Login button */}
              <LoginButton onClick={handleLogin}>
                Login to your account
              </LoginButton>
              {/* Display error message if login fails */}
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </InputContainer>
          </Form>
        </FormContainer>
      </Content>
      <ToastContainer />
    </Container>
  );
};

// Styled components for layout and styling
const Container = styled.div`
  position: relative;
`;

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  display: grid;
  grid-template-rows: 15vh 85vh;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  height: 85vh;
`;

const Form = styled.div`
  padding: 2rem;
  background-color: #000000b0;
  width: 25vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  color: white;
`;

const Title = styled.div`
  h3 {
    margin: 0;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  width: 15rem;
`;

const LoginButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #6ee2f5;
  border: none;
  cursor: pointer;
  color: white;
  border-radius: 0.2rem;
  font-weight: bolder;
  font-size: 1.05rem;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 0.5rem;
`;

export default Login;
