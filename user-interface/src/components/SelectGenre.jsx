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
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
`;