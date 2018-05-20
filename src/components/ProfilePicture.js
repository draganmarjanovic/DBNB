import React from 'react';

const profileStyle = {
    width: '200px'
}

class ProfilePicture extends React.Component {

    render() {
        return <img style={profileStyle} src={this.props.source} />;
      }

}

export default ProfilePicture;