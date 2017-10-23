import React, { Component } from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import { Route } from 'react-router-dom';
import { Dashboard, SearchPage } from './screens';

class BooksApp extends Component {

  render() {
    return (
      <div className="app">
        <Route exact path='/' component={Dashboard} />
        <Route exact path='/search' component={SearchPage} />
      </div>
    )
  }
}

export default BooksApp
