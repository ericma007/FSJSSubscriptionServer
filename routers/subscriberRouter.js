const express = require('express');
const subscriberBL = require('../models/subscriberBL');

const router = express.Router();

router.route('/')
    .get(async function(req,resp)
    {   

        let subs = await subscriberBL.getSubscribers()
        return resp.json(subs)
    })


router.route('/init')
    .get(async function(req,resp)
    {   
        let subs = await subscriberBL.getInitSubcribers()
        return resp.json(subs)
    })

router.route('/add')
    .post(async function(req,resp)
    {   
        console.log(req.body)
        let subs = await subscriberBL.addSubscriber(req.body)
        return resp.json(subs)
    })


    router.route('/delete/all/:id')
    .delete(async function(req,resp)
    {   
       try { 
            let id=req.params.id
            let status = await subscriberBL.deleteSubscriberAndSubscriptions(id)
            return resp.json(status)
       }
       catch(err) {

        next(err)
       }
    })

    router.route('/delete/:id')
    .delete(async function(req,resp)
    {   
        let id=req.params.id
        let status = await subscriberBL.deleteSubscriber(id)
        return resp.json(status)
    })




    router.route('/update')
    .put(async function(req,resp)
    {   
        let sub=req.body
        let status = await subscriberBL.updateSubscriber(sub._id,sub)
        return resp.json(status)
    })


module.exports = router;