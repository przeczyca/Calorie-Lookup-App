import React, {useState, useEffect} from "react"
import {useHistory} from "react-router-dom"
import Table from 'react-bootstrap/Table'
import FormControl from "react-bootstrap/FormControl"
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.css';

import MyNavbar from "./navbar"
import "./styles.css"

const HomePage = () => {
    const [loggedInUser, setLoggedInUser] = useState("")
    const [searchFood, setSearchFood] = useState("")
    const [foodData, setFoodData] = useState([])
    
    Axios.defaults.withCredentials = true

    const history = useHistory()

    useEffect(() => {
        Axios.get("/api/session").then((response) => {
            if (response.data.loggedIn === true) {
                setLoggedInUser(`logged in as ${response.data.user}`)
            } else {
                history.push("/login")
            }
        })
        Axios.get("/api/getsavedfooddata").then((response) => {
            setFoodData(response.data)
        })
    }, [])

    const search = () => {
        history.push({pathname: "./search", searchFood: searchFood})
    }

    const removeFood = (foodName) => {
        Axios.post("/api/removeFood", {foodName}).then((response) => {
            
            
        })
        let newFoodData = []
            foodData.map(food => {
                if (food.food_name !== foodName){
                    newFoodData.push(food)
                }
            })
            setFoodData(newFoodData)
    }

    return (
        <div>
            <MyNavbar />
            <div className="below-navbar">
                <InputGroup className="mb-3">
                    <FormControl
                    placeholder="Search Food"
                    aria-label="Search"
                    onChange={(e) => {
                        setSearchFood(e.target.value)
                    }}
                    onKeyPress = {event => {
                        if (event.key === 'Enter') {
                          search()
                        }
                    }}
                    />
                    <InputGroup.Append>
                    <Button variant="outline-info" onClick={search}>Search</Button>
                    </InputGroup.Append>
                </InputGroup>

                <br />
                
                {foodData.length > 0 &&
                    <Table striped>
                        <thead>
                            <th>remove</th>
                            <th>name</th>
                            <th>serving size</th>
                            <th>calories</th>
                            <th>proteins</th>
                            <th>fats</th>
                            <th>carbs</th>
                        </thead>
                        <tbody>
                            {foodData.map(food => (
                                <tr key={food.food_name}>
                                    <td><Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => {removeFood(food.food_name)}}>
                                        remove
                                    </Button></td>
                                    <td>{food.food_name}</td>
                                    <td>100 g</td>
                                    <td>{food.calories} kcal</td>
                                    <td>{food.proteins} g</td>
                                    <td>{food.fats} g</td>
                                    <td>{food.carbs} g</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                }
            </div>
        </div>
    )
}

export default HomePage