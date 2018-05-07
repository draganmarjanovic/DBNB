import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Test from "./pages/Test";
import Profile from "./pages/Profile";
import Deploy from "./pages/Deploy";

import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/DBNB" component={Home} />
                        <Route exact path="/DBNB/test" component={Test} />
                        <Route exact path="/DBNB/Profile" component={Profile} />
                        <Route exact path="/DBNB/Deploy" component={Deploy} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;