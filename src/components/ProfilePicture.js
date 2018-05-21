import React from 'react';
import axios from "axios";

const profileStyle = {
    width: '200px'
}

class ProfilePicture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: undefined
        }
    }

    componentDidMount() {
        //source={ "http://localhost:8080/ipfs/" +  this.state.searchAccount.getImageLocation() }
        axios.get(
            "http://localhost:8080/ipfs/" + this.props.account.getImageLocation()
        ).then((result) => {
            if (result.status == 200) {
                this.setState({ content: result.data });
            } else {
                throw new Error("Couldn't fetch image");
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        //return <img style={profileStyle} src={this.props.source} />;
        if (this.state.content === undefined) {
            return (
                <div></div>
            );
        }
        if (this.props.matchHeight) {
            return (
                <div style={ this.props.style }>
                    <img src={ this.state.content } height="100%" style={{ borderRadius: "3px", boxShadow: "0 0 0 1px rgba(16, 22, 26, 0.1), 0 2px 4px rgba(16, 22, 26, 0.2), 0 8px 24px rgba(16, 22, 26, 0.2)" }} />
                </div>
            )
        }
        return (
            <div style={ this.props.style }>
                <img src={ this.state.content } width="100%" style={{ borderRadius: "3px", boxShadow: "0 0 0 1px rgba(16, 22, 26, 0.1), 0 2px 4px rgba(16, 22, 26, 0.2), 0 8px 24px rgba(16, 22, 26, 0.2)" }} />
            </div>
        )
      }

}

export default ProfilePicture;