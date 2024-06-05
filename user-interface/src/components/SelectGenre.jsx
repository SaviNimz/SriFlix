import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchDataByGenre } from "../store";

export default function SelectGenre({ genres, type }) {
  const dispatch = useDispatch();

  // Handle change event for the select element
  const handleGenreChange = (e) => {
    dispatch(
      fetchDataByGenre({
        genres,
        genre: e.target.value,
        type,
      })
    );
  };

  return (
    <Select className="flex" onChange={handleGenreChange}>
      {/* Mapping through genres array to create option elements */}
      {genres.map((genre) => (
        <option value={genre.id} key={genre.id}>
          {genre.name}
        </option>
      ))}
    </Select>
  );
}

const Select = styled.select`
  margin-left: 5rem;
  cursor: pointer;
  font-size: 1.4rem;
  font-family: 'Open Sans', sans-serif;
  color: #fff;
  background-color: #333; /* Darker background */
  border: none;
  padding: 0.5rem 1rem 0.5rem 2rem; /* Adjust padding for arrow */
  border-radius: 5px;
  display: flex; /* Use flexbox for arrow positioning */
  align-items: center; /* Center text vertically */
  
  &::after {
    content: "";
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 8px solid white; /* White arrow */
    margin-left: 10px; /* Adjust arrow spacing */
  }
  
  &:hover {
    background-color: #444;
  }
`;