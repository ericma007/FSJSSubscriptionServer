const express = require('express');
const movieBL = require('../models/movieBL');

const router = express.Router();

router.route('/init')
    .get(async function(req,resp)
    {   
        let movies = await movieBL.getInitMovies()
        return resp.json(movies)
    })

router.route('/')
    .get(async function(req,resp)
    {   
       
        let movies = await movieBL.getMovies()
        return resp.json(movies)
    })

router.route('/add')
    .post(async function(req,resp)
    {   
        console.log("router add movie",req.body)
        let status = await movieBL.addMovie(req.body)
        return resp.json(status)
    })

router.route('/delete/:id')
    .delete(async function(req,resp)
    {   
        let id=req.params.id
        let status = await movieBL.deleteMovie(id)
        return resp.json(status)
    })

router.route('/update')
    .put(async function(req,resp)
    {   
        console.log("update movie")
        let status = await movieBL.updateMovie(req.body)
        return resp.json(status)
    })


module.exports = router;


