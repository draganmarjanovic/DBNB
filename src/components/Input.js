import React from "react";

import "../styles/components/input.scss";

export function Button (props) {
    return (
        <div className="button" onClick={ props.onClick }>
            <div>
                { props.children }
            </div>
        </div>
    );
}

export function Text (props) {
    return (
        <div className="text">
            <div>
                <label>{ props.label }:</label>
                <input type="text" text={ props.value } onChange={(event) => {
                    props.onChange(event.target.value);
                }} />
            </div>
        </div>
    )
}