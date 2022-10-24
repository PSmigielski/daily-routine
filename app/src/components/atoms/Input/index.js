import React from "react";

const Input = ({value, setValue, error, info}) => {
    return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

export default Input;