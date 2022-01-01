import fetch from 'node-fetch';

export const getUpcomingMovies = () => {
    return fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
    ).then((response) => {
        if (!response.ok) {
            throw new Error(response.json().message);
        }
        return response.json();
    })
        .catch((error) => {
            throw error
        });
};

export const getMovies = () => {
  return fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&include_video=false`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(response.json().message);
    }
    return response.json();
  })
  .catch((error) => {
     throw error
  });
};

export const getMovie = (args) => {
    const id = args
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_KEY}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.json().message);
      }
      return response.json();
    })
    .catch((error) => {
      throw error
   });
  };
    
export const getTopRated = async () => {
    return fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_KEY}&language=en-US`
        ).then((response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
         throw error
      });
    };

    export const getTvShows = () => {
        return fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&include_video=false&page=3`
        ).then((response) => {
          if (!response.ok) {
            throw new Error(response.json().message);
          }
          return response.json();
        })
        .catch((error) => {
           throw error
        });
      };

      export const getTvListings = () => {
        return fetch(
          `https://api.themoviedb.org/3/tv/airing_today?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&include_video=false&page=1`
        ).then((response) => {
          if (!response.ok) {
            throw new Error(response.json().message);
          }
          return response.json();
        })
        .catch((error) => {
           throw error
        });
      };

      export const getShow = (args) => {
        const id = args
        return fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_KEY}&language=en-US`
        ).then((response) => {
          if (!response.ok) {
            throw new Error(response.json().message);
          }
          return response.json();
        })
        .catch((error) => {
          throw error
       });
      };
    
  