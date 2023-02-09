import React from "react";

const Input = ({value, handleChange, handleBlur}) => {
    return <input value={value} onChange={handleChange} onBlur={handleBlur} />;
}

export default Input;