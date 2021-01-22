import React, {useState, useEffect} from "react"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {useHistory} from "react-router-dom"
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.css';

import "./styles.css"

const LoginPage = () => {

    const [usernameLogin, setUsernameLogin] = useState("")
    const [passwordLogin, setPasswordLogin] = useState("")
    const [message, setMessage] = useState("")
    const [loginPressed, setPressed] = useState(0)

    Axios.defaults.withCredentials = true

    let history = useHistory()

    function toRegister(){
        history.push("/register")
    }

    function toHome(){
        history.push("/")
    }

    const login = () => {
        Axios.post("/api/login", {
            username: usernameLogin,
            password: passwordLogin
        }).then((response) => {
            setPressed(loginPressed+1)
            if (response.data.message){
                setMessage(response.data.message)
            }
        })
    }

    useEffect(() => {
        Axios.get("/api/session").then((response) => {
            if (response.data.loggedIn === true) {
                toHome()
            }
        })
    }, [loginPressed])

    return(
        <div className="Login">
            <Form>
                <Form.Group size="lg" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="username"
                        placeholder="Enter Username"
                        onChange={(e) => {
                            setUsernameLogin(e.target.value)
                        }}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        onChange={(e) => {
                            setPasswordLogin(e.target.value)
                        }}
                    />
                    <div>{message}</div>
                </Form.Group>

                <Button
                    block
                    size="lg"
                    onClick={login}>
                    Login
                </Button>
                <Button
                    block
                    variant="outline-primary"
                    size="lg"
                    onClick={toRegister}>
                    Register
                </Button>
            </Form>
        </div>
    )
}

export default LoginPage