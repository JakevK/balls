# Balls.

A random ball drawing web app built for the NCEA AS91896 programming assessment.
The app uses a react frontend made with [create-react-app](https://github.com/facebook/create-react-app) and [react router](https://github.com/ReactTraining/react-router), 
alongside an api written in python with [flask](https://github.com/pallets/flask) to handle the storage of data.

## Requirements

To run this app you will need [yarn](https://github.com/yarnpkg/yarn) installed on your system.

## Getting started

To run the app you will need to open two separate terminal windows to the root directory of the project.

In one terminal start up the api:
```
yarn start-api

```
Then in the other terminal start the react frontend:
```
yarn start
```
This should automatically open up your default web browser to display the app.  If this does not happen, go to [http://localhost:3000/](http://localhost:3000/) in your browser.

## Notes
Many files are automatically generated by `create-react-app`

The files I wrote are:
- [/src/App.js](/src/App.js)
- [/src/App.css](/src/App.css)
- everything in [/src/components/](/src/components)
- [/api/api.py](/api/api.py)
- additional small edits in generated files


