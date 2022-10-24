import React from "react";

const useInput = (defaultState, defaultError) => {
    const [state, setState] = React.useState(defaultState);
    const [error, setError] = React.useState(defaultError);
    const reset = () => {
        setState(defaultState);
        setError(defaultError);
    };
    return [state, setState, error, setError, reset];
};

export default useInput;