const restaurantModel = require('../models/restaurants/restaurant');
const neighborhoodModel = require('../models/neighborhoods/neighborhood');
const categoryModel = require('../models/categories/category');
const reviewModel = require('../models/reviews/review');
const userModel = require('../models/users/user');
const boardModel = require('../models/boards/board');

const controller = {
  list: async (req, res) => {
    
    try {
      const [restaurants, neighborhoods, categories, reviews, day] 
      = await restaurantModel.getDataForList({});

      // return current users' boards
      let boards = null;
      if (req.session.user) {
        const user = await userModel.findOne({username: req.session.user}).exec();
        const user_id = user._id;
        boards = await boardModel.find({user_id}).exec();
      };

      res.render('restaurants/index', {restaurants, neighborhoods, categories, reviews, day, boards});
      return;

    } catch(err) {
      console.log(`Error getting restaurant lists: ${err}`);
    };
    
    res.render('restaurants/index', {restaurants:[]});
  },

  show: async (req, res) => {
    let restaurant = null;
    try {
      restaurant = await restaurantModel.findOne({slug: req.params.restaurant_slug}).exec();

      // get all categories
      const categories = await categoryModel.find().exec();

      // get all reviews from the restaurant
      const reviews = await reviewModel.find({restaurant_id: restaurant._id}).exec();

      // create map
      // const map = L.map('map').setView([restaurant.coordinates.latitude, restaurant.coordinates.longitude, ], 13);
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   maxZoom: 19,
      //   attribution: '© OpenStreetMap'
      // }).addTo(map);

      res.render('restaurants/show', {restaurant, categories, reviews});
      return;

    } catch(err) {
      console.log(`Error getting restaurant lists: ${err}`);
    };
    
    res.render('restaurants/show', {restaurant});
  
  }
};

module.exports = controller;