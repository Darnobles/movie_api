const express = require('express');

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

let topMovies = [
    {
        title: 'Dick Tracy',
        director: 'Warren Beatty'
    },
    {
        title: 'Wonder Woman',
        director: 'Patty Jenkins'
    },
    {
        title: 'Men in Black',
        director: 'Barry Sonnenfeld'
    },
    {
        title: 'Iron Man',
        director: 'Jon Favreau'
    },
    {
        title: 'X-Men 2',
        director: 'Bryan Singer'
    },
    {
        title: 'Captain America: The Winter Soldier',
        director: 'Joe and Anthony Russo'
    },
    {
        title: 'The Rocketeer',
        director: 'Joe Johnston'
    },
    {
        title: 'Guardians of the Galaxy',
        director: 'James Gunn'
    },
    {
        title: 'Thor: Ragnarok',
        director: 'Taika Waititi'
    },
    {
        title: 'Superman 2',
        director: 'Richard Donner and Richard Lester'
    },
];

app.use(express.static('documentation.html'));

app.get('/', (req, res) => {
    res.send('Welcome to Comic Flick!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root:__dirname});
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'log.txt'), {flags: 'a'}
);

app.use(morgan('combined', {stream: accessLogStream}));

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
