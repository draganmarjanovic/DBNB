import React from "react";
import { Link } from "react-router-dom";
import { Tabs, Tab } from "@blueprintjs/core";

import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Deploy from "../pages/Deploy";

import "../styles/grid.scss";
import "../styles/components/layout.scss";

export class Page extends React.Component {
    render() {
        return (
            <div className="home-root">
                <div className="home-content">
                    <div>
                        <Tabs id="navbar" large={ true } renderActiveTabPanelOnly={ true }>
                            <h3>DBNB</h3>
                            <Tabs.Expander />
                            <Tab id="home" title="Home" panel={<Home />} />
                            <Tab id="profile" title="Profile" panel={<Profile />} />
                            <Tab id="deploy" title="Deploy" panel={<Deploy />} />
                        </Tabs>
                    </div>
                </div>
                <div className="home-footer">
                    <Footer />
                </div>
            </div>
        )
    }
}

export function Header (props) {
    return (
        <div className="header-outer">
            <div>
                <div className="header-left">
                    <Link to="/DBNB">DBNB</Link>
                </div>
                <div className="header-right">{ props.children }</div>
            </div>
        </div>
    );
}

export function NavBar (props) {
    return (
        <div className="navbar-row">
            <div>
                <Link to="/DBNB/Profile">Profile</Link>
                <Link to="/DBNB/Link2">Link2</Link>
                <Link to="/DBNB/Link3">Link3</Link>
                <Link to="/DBNB/Link4">Link4</Link>
            </div>
        </div>
    );
}

export function Footer (props) {
    return (
        <div className="footer-outer">
            <div className="footer-upper">
                <div>
                    Some upper content
                </div>
            </div>
            <div className="footer-lower">
                <div>
                    <div>Left</div>
                    <div>Right</div>
                </div>
            </div>
        </div>
    );
}

export function Panel (props) {
    return (
        <div className="panel-outer">
            <div className="panel">
                <div className="panel-title">
                    { props.title }
                </div>
                <div className="panel-content">
                    { props.children }
                </div>
            </div>
        </div>
    );
}