import {
    configureStore,
    createAsyncThunk,
    createSlice,
  } from "@reduxjs/toolkit";
  import axios from "axios";
  import { API_KEY, TMDB_BASE_URL } from "../utils/constants";
  
  const initialState = {
    // array to store movies
    movies: [],
    genresLoaded: false,
    // array to load genres
    genres: [],
  };

  export const getGenres = createAsyncThunk("netflix/genres", async () => {
    const {data
    } = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=a105a7cd23a77e63b155b5a3c844c80f"
    );
    console.log(data);
    console.log('hello world');
    return genres;
  });

  //provided code defines a Redux slice for managing Netflix-related state, including 
  //handling the successful retrieval of genres data and updating the slice's state accordingly.
  const NetflixSlice = createSlice({
    name: "Netflix",
    initialState,
    extraReducers: (builder) => {
      builder.addCase(getGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
        state.genresLoaded = true;
      });
    },
  });

  export const store = configureStore({
    reducer: {
      netflix: NetflixSlice.reducer,
    },
  });