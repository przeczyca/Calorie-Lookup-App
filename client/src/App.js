import React, {useState, useEffect} from "react"
import {BrowserRouter as Router, Route} from "react-router-dom"

import LoginPage from "./components/loginPage"
import RegisterPage from "./components/registerPage"
import HomePage from "./components/homePage"
import SearchPage from "./components/searchPage"
//import './App.css';

function App() {

  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={HomePage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/search" component={SearchPage} />
      </Router>
    </div>
  );
}

export default App;