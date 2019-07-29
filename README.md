# ![Node/Express/Mongoose Example App](project-image.PNG)

> ### Example Node (Express + Mongoose) real world application example (CRUD, auth, REST, etc.).

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
- `npm run dev` to start the local server

Alternately, to quickly try out this repo in Heroku: https://real-estate-app-77.herokuapp.com/


# Code Overview

## Dependencies

- [body-parser](https://github.com/expressjs/body-parser) - Node.js body parsing middleware.
- [connect-flash](https://github.com/jaredhanson/connect-flash) - Flash message middleware for Connect and Express.
- [ejs](https://github.com/mde/ejs) - Embedded JavaScript templates.
- [express.js](https://github.com/expressjs/express) - The server for handling and routing HTTP requests.
- [express-session](https://github.com/expressjs/session) - Simple session middleware for Express.js.
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to JavaScript. 
- [passport](https://github.com/jaredhanson/passport) - For handling user authentication.


## Application Structure

- `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.

## Error Handling

In `routes/api/index.js`, we define a error-handling middleware for handling Mongoose's `ValidationError`. This middleware will respond with a 422 status code and format the response to have [error messages the clients can understand](https://github.com/gothinkster/realworld/blob/master/API.md#errors-and-status-codes)

## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT. We define two express middlewares in `routes/auth.js` that can be used to authenticate requests. The `required` middleware configures the `express-jwt` middleware using our application's secret and will return a 401 status code if the request cannot be authenticated. The payload of the JWT can then be accessed from `req.payload` in the endpoint. The `optional` middleware configures the `express-jwt` in the same way as `required`, but will *not* return a 401 status code if the request cannot be authenticated.


<br />

[![Brought to you by Thinkster](https://raw.githubusercontent.com/gothinkster/realworld/master/media/end.png)](https://thinkster.io)
 Heroku: https://real-estate-app-77.herokuapp.com/
