import React, {useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.css';

import "./styles.css"

const MyNavbar = () => {
    const [username, setUsername] = useState("username")

    let history = useHistory()

    useEffect(() => {
        Axios.get("/api/session").then((response) => {
            setUsername(response.data.user)
        })
    })

    const logout = () => {
        Axios.get("/api/logout").then((response) => {
            history.push("/")
        })
    }

    return (
        <Navbar bg="dark" variant="dark" fixed="top">
            <Navbar.Brand href="/">Calorie Counter</Navbar.Brand>
            <Nav className="mr-auto">
            </Nav>
            <Nav>
                <DropdownButton variant="secondary" menuAlign="right" title={username}>
                    <Dropdown.Item href="/login" onClick={logout}>log out</Dropdown.Item>
                </DropdownButton>
            </Nav>
        </Navbar>
    )
}

export default MyNavbar