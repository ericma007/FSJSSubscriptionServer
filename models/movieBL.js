const restDAL = require('../DALs/restDAL');
const MovieModel=require('./movieModel');
const subscriptionBL=require('./subscriptionBL')

const getInitMovies = async function()
{
    let resp = await restDAL.getMovies();
    //slice only first 15 movies
    let reducedList=resp.data.slice(0,15);
    return reducedList.map((item,index)=>
                {
                    return {name:item.name,
                    genres:item.genres,
                    premiered:item.premiered,
                    imageUrl:item.image.medium}
                })
}

const initMovies = async function()
{
    
    let movies=await getMovies()
    //check where subscription database is alreay initialized
    if (movies.length===0) { //not initialized
        //retrieve from apiMaze
        console.log("init movies")
        let initMovies = await getInitMovies()
        addBulk(initMovies)
    }
    else return 
}


const getMovies = function()
{
    
    return new Promise((resolve, reject) =>
    {
            MovieModel.find({}, function(err, data)
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    resolve(data)
                }
            })

    })
}

const getMovie = function(movieName)
{
    return new Promise((resolve, reject) =>
    {
            MovieModel.findOne({name:movieName}, function(err, data)
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                   if (data) {
                        resolve(data)
                   }
                   else reject("no such movie")
                }
            })

    })
}

const addBulk = function (docs)
{ 
    return new Promise((resolve, reject) =>
    {

        MovieModel.create(docs, function(err)          
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                    resolve("bulk added")
            }
        })

    })
}

const addMovie = function(movie)
{
    
    return new Promise((resolve, reject) =>
    {
        MovieModel.create(movie, function(err,obj){ 
        if(err)
        {
          reject(err)
        }
        else
        {
            console.log("mogoonse",obj)
            resolve("added")
        }})
    })        
    
}

const deleteMovie = function(id)
{
    return new Promise((resolve, reject) =>
    {
         
            subscriptionBL.deleteSubscriptionByMovieId(id)
            .then(res=>{
                console.log("delete subscriptions",res)
                MovieModel.findByIdAndDelete(id, function(err)
                {
                    if(err)
                    {
                        reject(err)
                    }
                    else
                    {
                        resolve('movies and related subscription(s) deleted')
                    }
                })
            }) 
            .catch(err => {
                console.log("subscriptions could not be deleted: ",err )
                reject(err)
            })
        
        
    })
}


const updateMovie = function(doc)
{
    return new Promise((resolve, reject) =>
    {
            MovieModel.findByIdAndUpdate(doc._id,doc, function(err)
            {
                if(err)
                {
                    reject(err)
                }
                else
                {   
                    resolve("updated")
                }
            })
    })
}



module.exports = {getInitMovies,getMovies,getMovie,addMovie,initMovies,updateMovie,deleteMovie}