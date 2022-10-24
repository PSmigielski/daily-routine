import React from "react";
import "./index.css";

const AuthForm = ({children, header}) => {
    return (
        <form className="auth_form" onSubmit={() => alert("XD")}>
            <h3>{header}</h3>
            {children}
        </form>
    )
}

export default AuthForm;