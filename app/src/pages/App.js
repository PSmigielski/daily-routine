import React from 'react';
import Logo from '../components/atoms/Logo';
import useInput from '../hooks/useInput';
import ContextAwareInput from '../components/molecules/ContextAwareInput';
import AuthForm from "../components/organism/AuthForm";

function App() {
  const [state, setState, error,,,] = useInput("", "")
  return (
    <div className="App">
        <AuthForm header={"Log in"}>
            <ContextAwareInput value={state} setValue={setState} error={error} info="test"/>
        </AuthForm>
        <Logo />
    </div>
  );
}

export default App;
