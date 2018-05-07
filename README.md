# DBNB
Decentralized AirBNB

## Install
Before running any commands, run `npm install` to download and install the required libraries.
Symlink src/contracts to build/contracts by running `npm run linkContracts`

## Usage
There are two main commands for running the website, `npm start` will allow you to edit and view the website live on your local machine at `localhost:3000/DBNB`.

## Project Layout
### Components
Javascript code for components are added under `src/components`. Styling for these components is under `src/styles/components`

### Pages
Pages code is located under `src/pages`. With adding pages, if the page is newly created make sure that a route exists under `src/App.js`