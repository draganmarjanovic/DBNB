import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/DBNB" component={Home} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;