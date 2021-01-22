import React, {useState} from "react"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {useHistory} from "react-router-dom"
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.css';

import "./styles.css"

const RegisterPage = () => {

    const [usernameRegister, setUsernameRegister] = useState("")
    const [password1Register, setPassword1Register] = useState("")
    const [password2Register, setPassword2Register] = useState("")
    const [message, setMessage] = useState("")
    
    let history = useHistory()
    
    function toLogin() {
        history.push("/login")
    }

    const register = () => {
        if (password1Register === password2Register) {
            Axios.post("/api/register", {
                username: usernameRegister,
                password: password1Register,
            }).then((response) => {
                if (response.data === "new user added") {
                    toLogin()
                } else {
                    setMessage("User already exists")
                }
            })
        } else{
            setMessage("Passwords need to be the same!")
        }
    }

    return(
        <div className="Login">
            <Form>
                <Form.Group size="lg" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="username"
                        placeholder="Enter Username"
                        onChange={(e) => {
                            setUsernameRegister(e.target.value)
                        }}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        onChange={(e) => {
                            setPassword1Register(e.target.value)
                        }}
                    />
                    <Form.Control
                        type="password"
                        placeholder="Re-enter Password"
                        className="margin-top"
                        onChange={(e) => {
                            setPassword2Register(e.target.value)
                        }}
                    />
                    <div>{message}</div>
                </Form.Group>

                <Button
                    block
                    size="lg"
                    onClick={register}>
                    Register
                </Button>
                <Button
                    block
                    variant="outline-primary"
                    size="lg"
                    type="submit"
                    onClick={toLogin}>
                    Log in
                </Button>
            </Form>
        </div>
    )
}

export default RegisterPage