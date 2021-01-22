import React, {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"
import Table from 'react-bootstrap/Table'
import FormControl from "react-bootstrap/FormControl"
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.css';

import MyNavbar from "./navbar"
import "./styles.css"

const SearchPage = (props) => {
    Axios.defaults.withCredentials = true

    const history = useHistory()
    const location = useLocation()

    const [searchTerm, setSearchTerm] = useState(location.searchFood)
    const [loggedInUser, setLoggedInUser] = useState("")
    const [searchData, setSearchData] = useState([])

    useEffect(() => {
        Axios.get("/api/session").then((response) => {
            if (response.data.loggedIn === true) {
                setLoggedInUser(`logged in as ${response.data.user}`)
            } else {
                history.push("/login")
            }
        })

        Axios.post("/api/search", {searchTerm}).then((response) => {
            setSearchData(response.data.foods)
        })
    }, [])

    const search = () => {
        Axios.post("/api/search", {searchTerm}).then((response) => {
        setSearchData(response.data.foods)
        })
    }

    const saveFood = (name, calories, proteins, fats, carbs) => {
        Axios.post("/api/savefood", {name, calories, proteins, fats, carbs}).then((response) => {
            console.log("food saved")
        })
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
                        setSearchTerm(e.target.value)
                    }}
                    />
                    <InputGroup.Append>
                    <Button variant="outline-info" onClick={search}>Search</Button>
                    </InputGroup.Append>
                </InputGroup>

                <br />
                <Table striped>
                    <thead>
                        <th>save</th>
                        <th>name</th>
                        <th>serving size</th>
                        <th>calories</th>
                        <th>proteins</th>
                        <th>fats</th>
                        <th>carbs</th>
                    </thead>
                    <tbody>
                        {searchData.map(food => (
                            <tr key={food.fdcId}>
                                <td><Button 
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => {
                                            saveFood(
                                                food.description,
                                                food.foodNutrients[3].value,
                                                food.foodNutrients[0].value,
                                                food.foodNutrients[1].value,
                                                food.foodNutrients[2].value
                                            )
                                        }}>
                                    save
                                    </Button></td>
                                <td>{food.description}</td>
                                <td>100 g</td>
                                <td>{food.foodNutrients[3].value} kcal</td>
                                <td>{food.foodNutrients[0].value} g</td>
                                <td>{food.foodNutrients[1].value} g</td>
                                <td>{food.foodNutrients[2].value} g</td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default SearchPage