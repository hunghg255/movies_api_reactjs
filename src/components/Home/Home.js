import React, { Component } from "react";

import HeroImage from "../elements/HeroImage/HeroImage";
import SearchBar from "../elements/SearchBar/SearchBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import MovieThumb from "../elements/MovieThumb/MovieThumb";
import LoadMoreBtn from "../elements/LoadMoreBtn/LoadMoreBtn";
import Spinner from "../elements/Spinner/Spinner";


import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE
} from "../../config";

import "./Home.css";

class Home extends Component {
  state = {
    movies: [],
    heroImage: null,
    loading: false,
    currentPage: 0,
    totalPage: 0,
    searchTerm: 0
  };

  componentDidMount() {
    this.setState({
      loading: true
    });
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    this.fetchItems(endpoint);
  }

  // TODO: Search Movies
  searchItems = searchTerm => {
    let endpoint = "";
    this.setState({
      movies: [],
      loading: true,
      searchTerm
    });

    if (searchTerm === "") {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    } else {
      endpoint = `${API_URL}search/movie/popular?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
    }

    this.fetchItems(endpoint);
  };

  // TODO: Load more movies
  loadMoreItems = () => {
    let endpoint = "";
    this.setState({ loading: true });

    if (this.state.searchTerm === 0) {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&${this.state.currentPage + 1}`;
    } else {
      endpoint = `${API_URL}search/movie/popular?api_key=${API_KEY}&language=en-US&query=${this.state.searchTerm}&page=${this.state.currentPage + 1}`;
    }

    this.fetchItems(endpoint);
  };

  //TODO: Fetch API
  fetchItems = async endpoint => {
    let result = await fetch(endpoint);
    let data = await result.json();
    this.setState({
        movies: [...this.state.movies, ...data.results],
        heroImage: this.state.heroImage || data.results[7],
        loading: false,
        currentPage: data.page,
        totalPage: data.total_pages
    });
  };

  render() {
    const { movies, heroImage, searchTerm, loading, currentPage, totalPage } = this.state;
    return (
        <div className="rmdb-home">
            { heroImage 
                ? (<div>
                    <HeroImage
                        image={ `${IMAGE_BASE_URL}${BACKDROP_SIZE}/${heroImage.backdrop_path}` }
                        title={ heroImage.original_title }
                        text={ heroImage.overview }
                    />
                    <SearchBar callback={this.searchItems} />
                </div>) 
                : null
            }

            <div className="rmdb-home-grid">
                <FourColGrid
                    header={ searchTerm ? "Search Result" : "Popular Movies" }
                    loading={ loading }
                >
                    {
                      movies.map((element, i) => {
                        return (
                            <MovieThumb
                              key={i}
                              clickable={true}
                              image={ element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}/${element.poster_path}` : "./images/no_image.jpg" }
                              movieId={ element.id }
                              movieName={ element.original_title }
                            />
                        );
                      })
                    }
                </FourColGrid>

                { loading ? <Spinner /> : null }

                {
                    (currentPage <= totalPage && !this.state.loading) 
                    ? (<LoadMoreBtn text="Load More" onClick={this.loadMoreItems} />) 
                    : null
                }
            </div>
        </div>
    );
  }
}

export default Home;
