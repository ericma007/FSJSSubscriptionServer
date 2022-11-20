const axios = require('axios');

const getMovies = function()
{
    return axios.get("https://api.tvmaze.com/shows")
}

const getUsers = function()
{
    return axios.get("https://jsonplaceholder.typicode.com/users")
}


module.exports = {getUsers,getMovies}