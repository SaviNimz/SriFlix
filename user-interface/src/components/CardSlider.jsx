import React, { useRef, useState } from "react";
import styled from "styled-components";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Card from "./Card";

// Export a memoized CardSlider component
export default React.memo(function CardSlider({ data, title }) {
  const listRef = useRef(); // Create a ref to access the slider DOM element
  const [sliderPosition, setSliderPosition] = useState(0); // State to keep track of the slider's position
  const [showControls, setShowControls] = useState(false); // State to show/hide navigation controls

  // Function to handle the direction of the slider
  const handleDirection = (direction) => {
    // Calculate the distance to move based on the current position of the slider
    let distance = listRef.current.getBoundingClientRect().x - 70;
    
    // If direction is left and the slider is not at the beginning
    if (direction === "left" && sliderPosition > 0) {
      // Move the slider to the right
      listRef.current.style.transform = `translateX(${230 + distance}px)`;
      setSliderPosition(sliderPosition - 1); // Update the slider position state
    }
    
    // If direction is right and the slider is not at the end
    if (direction === "right" && sliderPosition < 4) {
      // Move the slider to the left
      listRef.current.style.transform = `translateX(${-230 + distance}px)`;
      setSliderPosition(sliderPosition + 1); // Update the slider position state
    }
  };

  return (
    <Container
      className="flex column"
      showControls={showControls}
      onMouseEnter={() => setShowControls(true)} // Show controls on mouse enter
      onMouseLeave={() => setShowControls(false)} // Hide controls on mouse leave
    >
      <h1>{title}</h1>
      <div className="wrapper">
        <div
          className={`slider-action left ${
            !showControls ? "none" : ""
          } flex j-center a-center`}
        >
          <AiOutlineLeft onClick={() => handleDirection("left")} />
        </div>
        <div className="slider flex" ref={listRef}>
          {data.map((movie, index) => {
            return <Card movieData={movie} index={index} key={movie.id} />; // Render each item as a Card component
          })}
        </div>
        <div
          className={`slider-action right ${
            !showControls ? "none" : ""
          } flex j-center a-center`}
        >
          <AiOutlineRight onClick={() => handleDirection("right")} />
        </div>
      </div>
    </Container>
  );
});

const Container = styled.div`
  gap: 1rem;
  position: relative;
  padding: 2rem 0;
  h1 {
    margin-left: 50px;
  }
  .wrapper {
    .slider {
      width: max-content;
      gap: 1rem;
      transform: translateX(0px);
      transition: 0.3s ease-in-out;
      margin-left: 50px;
    }
    .slider-action {
      position: absolute;
      z-index: 99;
      height: 100%;
      top: 0;
      bottom: 0;
      width: 50px;
      transition: 0.3s ease-in-out;
      svg {
        font-size: 2rem;
      }
    }
    .none {
      display: none;
    }
    .left {
      left: 0;
    }
    .right {
      right: 0;
    }
  }
`;