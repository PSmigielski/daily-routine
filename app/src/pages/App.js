import React, {useState} from 'react';
import Logo from '../components/atoms/Logo';
import {ErrorMessage, Field, Form, Formik} from "formik";
import axios from "axios";

function App() {
    const api = axios.create({
        baseURL: "http://localhost:4000/v1/api",
        withCredentials: true
    });
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div className="App">
        <Logo />
        <Formik initialValues={{login: '', password: ''}}
                onSubmit={(values) => {
                    api.post("/auth/login", values)
                        .then(data => setLoggedIn(true)).catch(e => console.log(e))
                }}
                validate={values => {
                    const errors = {};
                    if (!values.login) errors.login = 'Required';
                    if(!values.password) errors.password = 'Required';
                    return errors;
                }}>
            { loggedIn ?
                (<div>dupa</div>) :
                (<Form>
                    <Field type={"text"} name={"login"}/>
                    <ErrorMessage name="login" component="div" />
                    <Field type={"password"} name={"password"}/>
                    <ErrorMessage name="password" component="div" />
                    <button type="submit">Submit</button>
                </Form>)
            }
        </Formik>
    </div>
  );
}

export default App;
