import React from "react";
import Input from "../../atoms/Input";
import InputDialogBox from "../../atoms/InputDialogBox";
import ErrorMessage from "../../atoms/ErrorMessage";

const ContextAwareInput = ({ value, setValue, info, error }) => {
    return (
        <div>
            <div>
                <Input value={value} setValue={setValue} />
                <InputDialogBox info={info} />
            </div>
            <ErrorMessage error={error} />
        </div>
    );
};

export default ContextAwareInput;