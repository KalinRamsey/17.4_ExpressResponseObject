const express = require('express');
const morgan = require('morgan');

const PORT = 8000;
const app = express();
app.use(morgan('dev'));

const playstore = require('./playstore.js');

app.get('/apps', (req, res) => {
  const { search, sort, genres } = req.query;

  if (sort) {
    if (!['Rating', 'App'].includes(sort)){
      return res
        .status(400)
        .send('Sort must be one of rating or app');
    }
  }
  if (genres) {
    if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)){
      return res
        .status(400)
        .send('Chosen genre not available. Please select from the following:\nAction\nPuzzle\nStrategy\nCasual\nArcade\nCard');
    }
  }

  let results = playstore.filter(app => {
    if(search){
      return app
        .App
        .toLowerCase()
        .includes(search.toLowerCase())
    } else {
      return app
        .App
    }
  })

  if (sort){
    results = results.sort((a,b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    })
  }
  if (genres) {
    results = results.filter(app => {
      return app.Genres.includes(genres);
    })
  }

  res.json(results);
})

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
})