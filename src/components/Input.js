import React from "react";

import "../styles/components/input.scss";

export function Button (props) {
    return (
        <div className="button" onClick={ props.onclick }>
            <div>
                { props.children }
            </div>
        </div>
    );
}