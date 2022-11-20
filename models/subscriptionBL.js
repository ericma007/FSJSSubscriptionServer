const SubscriptionModel = require('./subscriptionModel');
const movieBL=require('./movieBL')


const getAllSubscriptions = function()
{
    return new Promise((resolve, reject) =>
    {
            SubscriptionModel.find({}, function(err, data)
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

const getSubSubscriptions = function(subId)
{
    return SubscriptionModel.findOne({subscriberId:subId}).exec()
                
}

//returns all the subscriptions  of a subscriber that has subscribed to specific movie (by Movie Id)
const getMovieSubscriptions = function(movieId)
{
    return SubscriptionModel.find({"movies.movieId":movieId}).exec()
                
}

//delete all subscriptions related to subscriber 
const deleteSubscriberSubscriptions = function(subId) {
    return new Promise((resolve, reject) =>
    {
        SubscriptionModel.findOneAndDelete({subscriberId:subId}, function(err)
            {
                if (err)  reject(err)
                else resolve("All subscriber subscriptions deleted")
            })     
    })
}

//Delete subscriber subscription by providing subscriberId and movie title
const deleteSubscriberMovieSubscriptionBySubIdMovieName = function(subId,movieName) {
    return new Promise((resolve, reject) =>
    {
       
        getSubSubscriptions(subId)
        .then((data) => {
                if (data) // 👈 check that it is not null
                {
                    let arr=data.movies
                    let index=arr.findIndex(movie => movie.movieId.name===movieName)
                    if (index <0) {
                        reject("no corresponding subscription to delete")    
                    }
                    else {
                        if (arr.length >1) {
                            arr.splice(index,1)
                            SubscriptionModel.findOneAndUpdate({subscriberId:subId}
                                    ,{movies:arr}).exec()
                            .then(()=>{resolve("movie subscription deleted")})
                            .catch(err=>{
                                console.log("movie subscription deletion error")
                                reject(err)})
                        }
                        else deleteSubscriberSubscriptions(subId)
                    }
                }
                else {
                    reject("no subscription register for this subscriber")
                }
            })
        .catch(err=>reject(err))  
    })
}

//Delete  subscription by providing subscriberId and movie Id
const deleteSubscriptionBySubMovieID = function(subId,movieId) {
    return new Promise((resolve, reject) =>
    {

        getSubSubscriptions(subId)
        .then((data) => 
        {
                if (data) // 👈 check that it is not null
                {
                    let arr=data.movies
                    let index=arr.findIndex(movie => movie.movieId==movieId)
                    if (index <0) {
                        reject(`no such movie subscribed for the sub ${subId}to delete`)    
                    }
                    else {
                        if (arr.length >1) {
                            arr.splice(index,1)
                            SubscriptionModel
                                    .findOneAndUpdate({subscriberId:subId},{movies:arr})
                                    .exec()
                                    .then(()=>resolve("movie subscription deleted"))
                                    .catch((err)=>{
                                        console.log("error findoneandupdate",err)
                                        reject("movie subscription deletion error")})
                        }
                        else deleteSubscriberSubscriptions(subId)
                    }
                }
                else {
                    reject("no subscription registered for this subscriber")
                }
        })
        .catch(err=>reject(err))
    })
}


//delete all subscriptions related to specific movie by providing movie Id
const deleteSubscriptionByMovieId = function(movieId) {
    return new Promise((resolve, reject) =>
    { 
     
        getMovieSubscriptions(movieId)
        .then(subscriptions =>{
            if (Array.isArray(subscriptions) && subscriptions.length >0) {
                let promises = subscriptions.map(subscription=>
                { 
                  console.log("***sub id***",subscription,subscription.subscriberId)  
                  return deleteSubscriptionBySubMovieID(subscription.subscriberId,movieId)
                })
                Promise.all(promises)
                .then((values)=>{
                    console.log(subscriptions,values)
                    resolve(`All subscriptions linked to movie ${movieId} were successfully deleted`)
                })
                .catch((err)=>{
                    console.log("promise.all err",err)
                    reject(err)
                })
            }
            else  {
                resolve("no subscription needed to be deleted")
            }
        })
        .catch((err) => {
            reject(err)})
    })  
}

//delete all subscriptions from all subscribers where movie is subscribed (by movie name) 
const deleteMovieSubscriptionByMovieName = function(movieName) {
    return new Promise((resolve, reject) =>
    {
        movieBL.getMovie(movieName)
        .then((movie)=> {return getMovieSubscriptions(movie._id)})
        .then(subscriptions =>{
            if (Array.isArray(subscriptions) && subscriptions.length >0) {
                let promises = subscriptions.map(subscription=>
                { 
                  return deleteSubscriberMovieSubscription(subscription.subscriberId,movieName)
                })
                return Promise.all(promises)
            }
            else  {
                reject("this movie was not subscribed by the subscriber")
            }
        })
        .then(() => { resolve("success")})
        .catch((err) => {
            reject(err)} )
    })  
}

//adds a new movie subscription to a subscriber 
const addSubscriberSubscription = function(subId,newSubscription)
{
    return new Promise((resolve, reject) =>
    {
            //check whether subscirber had previous subscriptions or 1st subscirption
            getSubSubscriptions(subId).then((data) => 
            {
                
                if (data) // 👈 check that it is not null
                {
                   
                    data.movies.push({movieId:newSubscription.movieId,date:newSubscription.date})
                    SubscriptionModel.findOneAndUpdate({subscriberId:subId},data,function(err){
                        if(err) {
                            console.log(err)
                            reject(err)
                        }
                        resolve('subscription updated')
                    })
                }
                else {
                    doc={subscriberId: subId,
                        movies : [{movieId:newSubscription.movieId,date:newSubscription.date}]
                    }
                    SubscriptionModel.create(doc, function(err)
                    {
                        if(err)
                        {
                            reject(err)
                        }      
                        resolve("subscription created")
                        
                    })
                } 
            })   
    }) 
}



module.exports = {getAllSubscriptions,getSubSubscriptions,getMovieSubscriptions,  
                  addSubscriberSubscription,
                  deleteSubscriptionByMovieId,
                  deleteMovieSubscriptionByMovieName,
                  deleteSubscriberSubscriptions,
                  deleteSubscriberMovieSubscriptionBySubIdMovieName,
                  deleteSubscriptionBySubMovieID}