import React from "react";

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