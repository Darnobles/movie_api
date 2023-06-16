const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const express = require ('express');
const morgan = require ('morgan');
const bodyParser = require ('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("tiny"));



const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/cfDB', 
{ useNewUrlParser: true, useUnifiedTopology: true });

let users = [
    {
      id: 1,
      name: 'Charlie Smith',
      favoriteMovie: [],
    },
  
    {
      id: 2,
      name: 'Tina',
      favoriteMovie: [],
    },
  
    {
      id: 3,
      name: 'Zack',
      favoriteMovie: [],
    },
  ];


let topMovies = [
    {
        title: 'Dick Tracy',
        genres: {
            name: 'action',
            description:
            'An action film is built around the main character being thrust into a series of events which involve voilence, explosions and chases.',
        },
        description:
        'Detective Dick Tracy is trying to find evidence to put the city'/'s crime boss, Big Boy Caprice, away for good.',
        directors: {
            name: 'Warren Beatty',
            born: 'March 30, 1937',
            bio: 'Henry Warren Beatty is an American actor and filmmaker born in Richmond, Virginia.'
        }
    },
    {
        title: 'Wonder Woman',
        genres: {
            name: 'adventure',
            description:
            'Adventure films focuses on characters leaving their home or comfort zone to embark on a journey or to complete a goal.',
        },
        description:
        'A pilot crashes on a mysterious island and one of the Amazonian women there goes with him back to England to help them fight in the war.',
        directors: {
            name: 'Patty Jenkins',
            born: 'July 24, 1971',
            bio: 'Patricia Lea Jenkins is an American film director, screenwriter, and producer.'
        }
    },
    {
        title: 'Men in Black',
        genres: {
            name: 'sci-fi',
            description:
            'Sci-fi films depict real or imaginary science and technology as part of its theme or plot.',
        },
        description:
        'An average joe is recruited into a secert organization that protects earth from alien attacks.',
        directors: {
            name: 'Barry Sonnenfeld',
            born: 'April 1, 1953',
            bio: 'Barry Sonnenfeld is an American filmmaker and television director.'
        }
    },
    {
        title: 'Iron Man',
        genres: {
            name: 'action',
            description:
            'An action film is built around the main character being thrust into a series of events which involve voilence, explosions and chases.',
        },
        description:
        'A billionaire genius inventor gets kidnapped and after escaping creates a weaponized suit to help fight evil.',
        directors: {
            name: 'Jon Favreau',
            born:'October 19,1966',
            bio: 'Jon Favreau is an American director and actor. As well as the creator of the Disney+ series The Mandalorian.'
        }
    },
    {
        title: 'X-Men 2',
        genres: {
            name: 'action',
            description:
            'An action film is bulit around the main character being thrust into a series of events which invole voilence, explosion and chases.',
        },
        description:
        'Professor Xavier'/'s school is attacked and Wolverine searches for answers about his past.',
        directors: {
            name: 'Bryan Singer',
        born: 'September 17, 1965',
        bio: 'Bryan Singer is an American director, producer and screenwriter. He is also the founder of Bad Hat Harry Productions.'
        }
    },
    {
        title: 'Captain America: The First Avenger',
        genres: {
            name: 'sci-fi',
            description:
            'Sci-fi films depict real or imaginary science and technology as part of its theme or plot.',
        },
        description:
        'Rejected by the military, Steve Rogers under goes an experimental procedure to turn him into a supersoldier.',
        directors: {
            name: 'Joe Johnston',
            born: 'May 15, 1950',
            bio:'Joe Johnston is an American film director from Texas. He is known for his effect-driven films such as Jumanji and Jurassic Park III.',
        }
    },
    {
        title: 'The Rocketeer',
        genres: {
            name: 'action',
            description:
            'An action film is built around the main character being thrust into a series of events which involve voilence, explosions and chases.',
        },
        description:
        'A stunt pilot, Cliff Secord, finds a jet pack and becomes a flying hero known as The Rocketeer',
        directors: {
            name: 'Joe Johnston',
            born: 'May 13, 1950',
            bio: 'Joe Johnston is an American film director from Texas. He is known for his effect-driven films such as Jumanji and Jurassic Park III.',
        }
    },
    {
        title: 'Guardians of the Galaxy',
        genres: {
            name: 'adventure',
            description:
            'Adventure films focuses on characters leaving their home or comfort zone to embark on a journey or to complete a goal.',
        },
        description:
        'As a boy, Peter Quill is Kidnapped from earth and raised by a group of criminals. Now all grown up Peter finds himself the target of a manhunt led by Ronan the Accuser.',
        directors: {
            name: 'James Gunn',
            born: 'August 5,1966',
            bio: 'James Gunn is an American filmmaker born in St. Louis Missouri. He began his career as a screen writer and is known for writing and directing Guardians of the Galaxy.'
        }
    },
    {
        title: 'Thor: Ragnarok',
        genres: {
            name:'adventure',
            description:
            'Adventure films focuses on characters leaving their home or comfort zone to embark on a journey or to complete a goal.',

        },
        description: 'Thor finds himself imprisoned on the other side of the universe and he must escape to save his home planet from his sister, Hela.',
        directors: {
            name: 'Taika Waititi',
            born: 'August 16, 1975',
            bio: 'Taika Waititi is a New Zealand Filmmaker, actor and comedian.'
        }
    },
    {
        title: 'Superman 2',
        genres: {
            name:'action',
            description:
            'An action film is built around the main character being thrust into a series of events which involve voilence, explosions and chases.',

        },
        description: 'Superman accidently releases General Zod from his prison in outer space. Now he has to act to save Earth before it'/'s too late.',
        directors: {
            name: 'Richard Donner',
            born: 'April 24, 1930',
            died: 'July 5, 2021',
            bio: 'Richard Donner is an American filmmaker born in the Bronx, New York City.'
        }
    },
];

let logger = (req, res, next) => {
  console.log(req.url);
  next();
};

app.use(logger);

app.get('/', (req, res) => {
    res.send('Welcome to Comic Flick!');
});

//get all movies
app.get('/movies', (req, res) => {
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
app.get("/movies/:title", (req, res) => {
    const { title } = req.params;
    Movies.findOne({ title: title})
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(404).send("Could not find that movie");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

//get movies by genre name
app.get("/movies/genres/:genreName", (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find((movie) => movie.genres.name === genreName).genres;
  
    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(404).send("Could not find that genre.");
    }
  });

//find movie by director name
app.get("/movies/directors/:directorName", (req, res) => {
    const { directorName } = req.params;
    Movies.findOne({ "directors.name": directorName})
    .then((movie) => {
      if (movie) {res.status(200).json(movie);
      } else {
        res.status(404).send("Could not find director.");
      }
    })
    .catch((err) => {
      console. error(err);
      res.status(500).send("Error: " + err);
    });
  });

//add a user
app.post("/users", (req, res) => {
  Users.findOne({Username: req.body.Username})
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exisits');
      } else {
        User
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//find user by username
app.get('/users/:Username', (req, res) => {
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
app.get('/users', (req, res) => {
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
  app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true },
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

  //add movie to favorites
  app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

  // delete movie from favorites
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.findOneAndDelete((user) => user.id == id);

  if (user) {
    user.favoriteMovie = user.favoriteMovie.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user's favorites`);
  } else {
    res.status(404).send("User not found.");
  }
});
  
  // delete user by username
  app.delete('/users/:Username', (req, res) => {
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
  
app.use(express.static("public"));
  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Error!");
  });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
