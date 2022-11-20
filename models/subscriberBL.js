const restDAL = require('../DALs/restDAL');
const SubscriberModel = require('./subscriberModel');
const SubscriptionModel = require('./subscriptionModel');


const initSubscribers = async function()
{
    let subs=await getSubscribers()
    //check where subscription database is alreay initialized
    if (subs.length===0) { //not initialized
        //retrieve from typicode
        console.log("init subscribers")
        let initSubs = await getInitSubcribers()
        addSubscriber(initSubs)
    }
    return 
}


const getInitSubcribers = async function()
{      
    let resp = await restDAL.getUsers();
    return resp.data;   
}


const getSubscribers = function()
{
    return new Promise((resolve, reject) =>
    {
            SubscriberModel.find({}, function(err, data)
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

const addSubscriber = function(doc)
{
    return new Promise((resolve, reject) =>
    {
            SubscriberModel.create(doc, function(err)
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    resolve("added")
                }
            })

    })
}

/* delete subscriber by subId and his related subscriptions  */
const deleteSubscriberAndSubscriptions=function(subId) {

return new Promise((resolve,reject)=> 
    {
        SubscriberModel.findByIdAndDelete(subId).exec()
        .then(()=> SubscriptionModel.findOneAndDelete({subscriberId:subId}).exec())
        .then(resolve("success"))
        .catch((err) => reject(err))
    })
}

const deleteSubscriber = function(id)
{
    return new Promise((resolve, reject) =>
    {
            SubscriberModel.findByIdAndDelete(id, function(err)
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    resolve('deleted')
                }
            })

    })
}


const updateSubscriber = function(id,doc)
{
    return new Promise((resolve, reject) =>
    {
            SubscriberModel.findByIdAndUpdate(id,doc, function(err)
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


module.exports = {initSubscribers,getInitSubcribers,
                  getSubscribers,addSubscriber,
                  updateSubscriber,deleteSubscriber,deleteSubscriberAndSubscriptions}