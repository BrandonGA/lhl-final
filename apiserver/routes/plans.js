
"use strict";

const express = require('express');
const router  = express.Router();
const _ = require('underscore-node');

module.exports = (knex) => {

  // Get ALL plans
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("plans")
      .then((results) => {
        res.json(results);
    }, (rej) => {
      res.sendStatus(400)
    });
  });

  //Get Items for a Plan
  router.get("/plan_item/:id", (req, res) => {
    knex
      .select('item_id')
      .where('plan_id', "=", req.params.id)
      .from("plans_items")
      .then( (results) => {
        return _.pluck(results, 'item_id')
      })
      .then( (items) => {
        return knex.select('*').from('items').whereIn('id', items);
      })
      .then( (results) => {
        res.json(results)
      })
      .catch( (error) => {
        console.error(error);
        res.sendStatus(500);
      });
  });

  // insert plans.
  router.post("/", (req, res) => {
    knex("plans")
      .returning('*')
      .insert({
        name: req.body.name,
        description: req.body.description,
        owner_id: req.body.owner_id,
        avg_rating: req.body.avg_rating,
        likes: req.body.likes,
        tod: req.body.tod
      }).then( (results) => {
          //console.log("Response: ", res);
          res.sendStatus(200);
      }, (rej) => {
        res.sendStatus(500);
      });
    });

    // insert plans/items.
    router.post("/plan_item/", (req, res) => {
      knex("plans_items")
        .returning('id')
        .insert({
          plan_id: req.body.plan_id,
          description: req.body.description,
          item_id: req.body.item_id,
        }).then( (results) => {
            res.sendStatus(200);
        }, (rej) => {
          res.sendStatus(500);
        });
      });

    // Update plans.
    router.put("/update/", (req, res) => {
      knex("plans")
      .where({
        id: req.body.id
      })
      .update({
        name: req.body.name,
        description: req.body.description,
        owner_id: req.body.owner_id,
        avg_rating: req.body.avg_rating,
        likes: req.body.likes,
        tod: req.body.tod
      })
      .then( (results) => {
        res.sendStatus(200)
      }, (rej) => {
        res.sendStatus(400)
      })
    });

    // get plans through its ID. Returns JSON.
    router.get("/:id", (req, res) => {
      console.log(req.params)
      knex
        .select("*")
        .where('id', "=", req.params.id)
        .from("plans")
        .then( (results) => {
          res.json(results);
        }, (rej) => {
          res.sendStatus(400)
        });
    });

    // get plans belonging to a user ID. Returns JSON.
    router.get("/plan_user/:id", (req, res) => {
      console.log(req.params)
      knex
        .select("*")
        .where('owner_id', "=", req.params.id)
        .from("plans")
        .then( (results) => {
          res.json(results);
        }, (rej) => {
          res.sendStatus(400)
        });
    });

return router;
}
