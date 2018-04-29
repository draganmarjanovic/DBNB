import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Test from "./pages/Test";

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/DBNB" component={Home} />
                        <Route exact path="/DBNB/test" component={Test} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;