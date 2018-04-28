import React from "react";
import { Page, Panel } from "../components/Layout";
import { Button } from "../components/Input";

import "../styles/grid.scss";

class Home extends React.Component {
    render() {
        return (
            <Page title="Home">
                <div className="row">
                    <div className="col-sm-12">
                        <Panel title="Huge">
                            This is a masshive panel
                        </Panel>
                    </div>
                    <div className="col-sm-6">
                        <Panel title="Smaller">
                            A smaller Panel but still pretty big<br />
                            <Button onclick={() => {
                                console.log("Click");
                            }}>Some Button</Button>
                        </Panel>
                    </div>
                </div>
            </Page>
        );
    }
}

export default Home;