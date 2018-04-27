import React from "react";
import { Link, Redirect } from "react-router-dom";
import "../styles/grid.scss";
import "../styles/components/layout.scss";

export class Page extends React.Component {
    render() {
        return (
            <div className="home-root">
                <div className="home-header">
                    <Header>Content</Header>
                    <NavBar />
                </div>
                <div className="home-content">
                    { this.props.children }
                </div>
                <div className="home-footer">
                    Some Footer
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
                    <Link to="DBNB">DBNB</Link>
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
                <Link to="DBNB/Profile">Profile</Link>
                <Link to="DBNB/Link2">Link2</Link>
                <Link to="DBNB/Link3">Link3</Link>
                <Link to="DBNB/Link4">Link4</Link>
            </div>
        </div>
    );
}