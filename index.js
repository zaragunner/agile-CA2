import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import genresRouter from './api/genres';
import showsRouter from './api/shows'
import './db';
import './SeedData'
import usersRouter from './api/users';
import session from 'express-session';
import authenticate from './authenticate';
import passport from './authenticate';



dotenv.config();
const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍. Here's the details: ${err.stack} `);
};



const app = express();
app.use(express.static("public"));
app.use(
  session({
    secret: "ilikecake",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
const port = process.env.PORT;
app.use(express.json());
app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
app.use('/api/shows', passport.authenticate('jwt', {session: false}),showsRouter);
app.use('/api/genres', genresRouter );
app.use('/api/users', usersRouter);
app.use(errHandler);


let server = app.listen(port, () => {
  console.info(`Server running at ${port}`);
});
module.exports = server
