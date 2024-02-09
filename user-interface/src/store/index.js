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
    const {
      data: { genres },
    } = await axios.get(
        "https://api.themoviedb.org/3/genre/movie/list?api_key=a105a7cd23a77e63b155b5a3c844c80f"
    );
    return genres;
  });
  
// Description: This function processes raw movie data and extracts relevant information such as movie name, image, and genres.
// Parameters:
//   - array: Raw array of movie objects.
//   - moviesArray: Array to store processed movie objects.
//   - genres: Array of genre objects.
// Process:
//   - Iterates over each movie object.
//   - Extracts genre names for each movie from genre IDs.
//   - Creates a processed movie object with relevant information.
//   - Pushes processed movie object to moviesArray.

const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = [];
    movie.genre_ids.forEach((genre) => {
      const name = genres.find(({ id }) => id === genre);
      if (name) movieGenres.push(name.name);
    });
    if (movie.backdrop_path)
      moviesArray.push({
        id: movie.id,
        name: movie?.original_name ? movie.original_name : movie.original_title,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
      });
  });
};

// Description: This function fetches raw movie data from the TMDb API based on specified parameters such as API endpoint, genres, and paging.
// Parameters:
//   - api: Base URL of the TMDb API endpoint.
//   - genres: Array of genre objects.
//   - paging: Boolean indicating whether to enable paging for fetching multiple pages of data.
// Process:
//   - Initializes an empty array to store processed movie objects.
//   - Iterates over API pages until a condition is met.
//   - Makes HTTP GET requests to the TMDb API using Axios.
//   - Extracts movie data from the response and passes it to createArrayFromRawData for processing.
//   - Returns the processed movie array.

  const getRawData = async (api, genres, paging = false) => {
    const moviesArray = [];
    for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
      const {
        data: { results },
      } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
      createArrayFromRawData(results, moviesArray, genres);
    }
    console.log(moviesArray);
    return moviesArray;
  };

// Description: This Redux thunk function fetches movie data by genre asynchronously.
// Parameters:
//   - { genre, type }: Object containing genre and type parameters.
//   - thunkAPI: Redux thunk API object for accessing state and dispatching actions.
// Process:
//   - Retrieves genre data from the Redux store state.
//   - Calls getRawData function with appropriate parameters based on specified genre and type.
//   - Returns the fetched movie data.
  
// Function to fetch data by genre asynchronously
export const fetchDataByGenre = createAsyncThunk(
    "netflix/genre", // Action type string
    async ({ genre, type }, thunkAPI) => { // Asynchronous function taking in genre, type, and thunkAPI
      const {
        netflix: { genres }, // Destructuring genres from netflix slice of Redux state
      } = thunkAPI.getState(); // Accessing Redux state using thunkAPI
      // Fetching raw data using getRawData function with the appropriate API URL
      return getRawData(
        `https://api.themoviedb.org/3/discover/${type}?api_key=a105a7cd23a77e63b155b5a3c844c80f&with_genres=${genre}`,
        genres // Passing genres as a parameter
      );
    }
  );
  
  // Function to fetch trending movies asynchronously
  export const fetchMovies = createAsyncThunk(
    "netflix/trending", // Action type string
    async ({ type }, thunkAPI) => { // Asynchronous function taking in type and thunkAPI
      const {
        netflix: { genres }, // Destructuring genres from netflix slice of Redux state
      } = thunkAPI.getState(); // Accessing Redux state using thunkAPI
      // Fetching raw data using getRawData function with the appropriate API URL
      return getRawData(
        `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
        genres, // Passing genres as a parameter
        true // Flag indicating this is for trending movies
      );
    }
  );
  
  

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