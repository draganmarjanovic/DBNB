import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Test from "./pages/Test";
import Profile from "./pages/Profile";
import Deploy from "./pages/Deploy";

import { Page } from "./components/Layout";

import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./styles/grid.scss";
import "./styles/variables.scss";

class App extends React.Component {
    render() {
        return (
            <Page />
        );
    }
}

export default App;