const express = require("express");
const subscriptionBL = require("../models/subscriptionBL");

const router = express.Router();

router.route("/").get(async function (req, resp) {
  let subscriptions = await subscriptionBL.getAllSubscriptions();
  return resp.json(subscriptions);
});

router.route("/:subId").get(async function (req, resp) {
  let subscriptions = await subscriptionBL.getSubSubscriptions(req.params.subId);
  return resp.json(subscriptions);
});

router.route("/movie/:movieId").get(async function (req, resp) {
  try {
    let subscriptions = await subscriptionBL.getMovieSubscriptions(
      req.params.movieId
    );
    return resp.json(subscriptions);
  } catch (err) {
    return resp.json(err);
  }
});

//enables to delete all subscriber subscriptions or specific movie subscription
router.route("/delete/:subId").delete(async function (req, resp) {
  let id = req.params.subId;
  const movieName = req?.query.movie;
  let status;
  try {
    if (movieName) {
      console.log(movieName);
      status =
        await subscriptionBL.deleteSubscriberMovieSubscriptionBySubIdMovieName(
          id,
          movieName
        );
    } else {
      status = await subscriptionBL.deleteSubscriberSubscriptions(id);
    }
    return resp.json(status);
  } catch (err) {
    return resp.json(err);
  }
});
router.route("/delete/movie/id/:movieId").delete(async function (req, resp) {
  try {
    let status = await subscriptionBL.deleteSubscriptionByMovieId(
      req.params.movieId
    );
    return resp.json(status);
  } catch (err) {
    return resp.json(err);
  }
});

router.route("/delete/movie/:movieName").delete(async function (req, resp) {
  try {
    let status = await subscriptionBL.deleteMovieSubscriptionByMovieName(
      req.params.movieName
    );
    return resp.json(status);
  } catch (err) {
    return resp.json(err);
  }
});

router.route("/add/:subId").post(async function (req, resp) {
  let id = req.params.subId;
  let movie = req.body;
  console.log("add subscription", id, movie);
  let status = await subscriptionBL.addSubscriberSubscription(id, movie);
  return resp.json(status);
});

module.exports = router;
