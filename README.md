# ﻿Questioner

## Introduction
Questioner is a full stack application for crowd-sourcing questions for a meetup. ​It helps the meetup organizer prioritize  questions to be answered. Other users can vote on asked questions and they bubble to the top  or bottom of the log.

[![Maintainability](https://api.codeclimate.com/v1/badges/44d33e84bea8951b1f81/maintainability)](https://codeclimate.com/github/TheDrizzyWay/Questioner/maintainability) [![Build Status](https://travis-ci.org/TheDrizzyWay/Questioner.svg?branch=develop)](https://travis-ci.org/TheDrizzyWay/Questioner) [![Coverage Status](https://coveralls.io/repos/github/TheDrizzyWay/Questioner/badge.svg?branch=develop)](https://coveralls.io/github/TheDrizzyWay/Questioner?branch=develop) [![License:   MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Questioner API

The application's front-end is hosted on gh-pages [here](https://thedrizzyway.github.io/Questioner/UI)

Version 1 (v1) of the Questioner API is hosted on Heroku at: [https://drizzyquestioner.herokuapp.com/api/v1](https://drizzyquestioner.herokuapp.com/api/v1/) and the documentation can be found [here](https://drizzyquestioner.herokuapp.com/docs)

## Features

- Admins can create meetups
- Users can join meetups
- Users can post and vote on questions
- Users can post comments

## Dependencies

To install Questioner, you will need the following:
- Node.js
- PostgreSQL
- Other dependencies required are listed in the package.json file. Use `npm install` on the command line to install them.
- Environment variables are defined in a .env file. You can find a .env.example file in the repository root to guide you on setting up your .env file.

***
### Tools

> Frontend (UI)
> - HTML for webpage layout
> - CSS for styling
> - Javascript for dynamic behaviour

> Backend (api)
> - Node js for server-side logic
> - Express for routing
> - Babel for transpiling source code

> Test Driven Development (TDD)
> - Mocha and Chai for testing api routes
> - Chai-http for simulating http calls

> Continuous Integration
> - Travis CI for automated testing
> - Codeclimate for code quality report
> - Coveralls for test coverage

***

## Installation
1. Install [**Node JS**](https://nodejs.org/en/).
2. Clone this repository [**here**](https://github.com/TheDrizzyWay/Questioner.git)
3. [**cd**] into the root of the **project directory**.
4. Run `npm install` on the terminal to install Dependencies
5. Then run the app with the command `npm start`

## License

This project is available for use and modification under the MIT License. See the LICENSE file for more details.

### Project Management
This project is managed with Pivotal Tracker and can be found [here](https://www.pivotaltracker.com/n/projects/2232521)

### Acknowledgment
- Andela
- Andela Learning Facilitators
- My mom's spaghetti :heart:
