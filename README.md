# DBNB
Decentralized AirBNB

## Install
Before running any commands, run `npm install` to download and install the required libraries.
Symlink src/contracts to build/contracts by running `npm run linkContracts`

## Usage
There are two main commands for running the website, `truffle compile` will compile all the solidity file and place them in the build directory. And `npm start` will allow you to edit and view the website live on your local machine at `localhost:3000/DBNB`.

## First Run
When you are first running the app please make sure that there is a symbolic link between the src/contracts and build/contracts (You must run `truffle compile` first). Also on both first run and everytime you change the solidity files, you must run `truffle compile` to compile the scripts, then start the server like normal and navigate to `localhost:3000/DBNB/Deploy`. Then change the address in `src/config.js` to the new address from the deploy page. Once saved the new script should be used

## Project Layout
### Components
Javascript code for components are added under `src/components`. Styling for these components is under `src/styles/components`

### Pages
Pages code is located under `src/pages`. With adding pages, if the page is newly created make sure that a route exists under `src/components/Layout.js`
