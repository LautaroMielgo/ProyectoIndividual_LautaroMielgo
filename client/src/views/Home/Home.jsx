import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideogames, searchVideoGames, getGenres, sortVideogames, setCurrentPage, getDatabaseVideogames } from '../../redux/actions';
import style from "./Home.module.css"

import CardsContainer from '../../components/CardsContainer/CardsContainer';

const Home = () => {
  const dispatch = useDispatch();
  const allVideogames = useSelector((state) => state.videogames);
  const databaseVideogames = useSelector((state) => state.databaseVideogames);
  const genres = useSelector((state) => state.genres);
  const currentPage = useSelector((state) => state.currentPage);  
  const gamesPerPage = useSelector((state) => state.gamesPerPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('allGenres');
  const [selectedOrigin, setSelectedOrigin] = useState('allOrigins');
  const [filteredVideogames, setFilteredVideogames] = useState([]);

  const [sortBy, setSortBy] = useState('');

  

  useEffect(() => {
    dispatch(getGenres());
    dispatch(getVideogames());
    dispatch(getDatabaseVideogames()); 
  }, [dispatch, currentPage, gamesPerPage]);

  useEffect(() => {
    const filterVideogames = () => {
      let filtered = [];
  
      if (selectedOrigin === 'API') {
        filtered = [...allVideogames];
      } else if (selectedOrigin === 'Database') {
        filtered = [...databaseVideogames];
      } else {
        filtered = [...allVideogames, ...databaseVideogames];
      }
  
      if (selectedGenre !== 'allGenres') {
        filtered = filtered.filter((game) => game.genres.includes(selectedGenre));
      }
  
      if (searchQuery.trim() !== '') {
        filtered = filtered.filter((game) =>
          game.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
  
      setFilteredVideogames(filtered);
    };
  
    filterVideogames();
  }, [selectedGenre, selectedOrigin, allVideogames, databaseVideogames, searchQuery]);
  
  
  
  
  

  useEffect(() => {
    const sortVideogameList = () => {
      if (sortBy !== '') {
        dispatch(sortVideogames(sortBy));
      }
    };

    sortVideogameList();
  }, [sortBy, dispatch]);

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      if (selectedOrigin === 'Database') {
        dispatch(searchVideoGames(searchQuery, 'Database'));
      } else {
        dispatch(searchVideoGames(searchQuery, 'API'));
      }
    } else {
      dispatch(getVideogames());
    }
    setSearchQuery('');
  };
  
  

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleGenreChange = (event) => {
    const genre = event.target.value;
    setSelectedGenre(genre);
  };

  const handleOriginChange = (event) => {
    const origin = event.target.value;
    console.log(origin);
    setSelectedOrigin(origin);
  };

  const handleSortByChange = (event) => {
    const sortOption = event.target.value;
    if (sortOption === 'None') {
      setSortBy('');
      dispatch(getVideogames()); 
    } else {
      setSortBy(sortOption);
      dispatch(setCurrentPage(1));
    }
  };

  return (
    <div>
      <div className={style.filtros}>
        <div>
          <input type="text" value={searchQuery} onChange={handleInputChange} />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div>
          <label htmlFor="genreSelect">Filter by Genre: </label>
          <select id="genreSelect" value={selectedGenre} onChange={handleGenreChange}>
            <option value="allGenres">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="originSelect">Filter by Origin: </label>
          <select id="originSelect" value={selectedOrigin} onChange={handleOriginChange}>
            <option value="allOrigins">All Origins</option>
            <option value="API">API</option>
            <option value="Database">Database</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortBySelect">Sort by: </label>
          <select id="sortBySelect" value={sortBy} onChange={handleSortByChange}>
            <option value="None">None</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="rating_asc">Rating (Low to High)</option>
            <option value="rating_desc">Rating (High to Low)</option>
          </select>
        </div>

        <div>
          <button onClick={() => dispatch(setCurrentPage(currentPage - 1))} disabled={currentPage === 1}>
            Previous
          </button>

          <span>{currentPage}</span>
          
          <button onClick={() => dispatch(setCurrentPage(currentPage + 1))} disabled={allVideogames.length < gamesPerPage}>
            Next
          </button>
        </div>

        

      </div>
      <CardsContainer videogames={filteredVideogames} />
      </div>


  );
};

export default Home;











