const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB', 
{ useNewUrlParser: true, 
  useUnifiedTopology: true 
});

const cors = require ('cors');
app.use(cors());

app.use(bodyParser.json());
let auth = require('./auth')(app);

app.use(bodyParser.urlencoded({extended:true}));

const passport = require('passport');
require('./passport');

const accessLogScream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a'
});

app.use(morgan('combined', {steam: accessLogScream}));

app.use(express.static("public"));


app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('Welcome to Comic Flick!');
});

//get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//get movie by title
app.get("/movies/:title", passport.authenticate('jwt', { session: false }), 
(req, res) => {
    Movies.findOne({ Title: req.params.title})
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

//get movies by genre name
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  Movies.find({ 'Genre.Name': req.params.genreName })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).send('Error: ' + err);
    });
  });

//find movie by director name
app.get('/movies/directors/:directorsName', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  Movies.find({ 'Director.Name': req.params.directorsName })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).send('Error: ' + err);
    });
});

//add a user
app.post('/users', 
(req, res) => {
  Users.findOne({ Username: req.body.Username }).then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
    }
  });
});

//find user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get all users
app.get('/users', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//update user info by user name
app.put('/users/:userName', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.userName },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("Error: User doesn't exist");
      } else {
        res.json(updatedUser);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

  //add movie to user's favorites
  app.post('/users/:userName/movies/:MovieID', passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.userName },
      {
        $addToSet: { FavoriteMovies: req.params.MovieID }
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });
  

  // delete movie from favorites
  app.delete('/users/:userName/movies/:MovieID', passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.userName },
      {
        $pull: { FavoriteMovies: req.params.MovieID }
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  
  // delete user by username
  app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something Broke");
  });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
