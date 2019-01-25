import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import AsyncSelect from 'react-select/lib/Async'
import axios from 'axios'
import './styles.css'
//
const NEW_API_KEY = '?api_key=cfe422613b250f702980a3bbf9e90716'
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie'
const LANGUAGE = '&language=en-US&'
const END_OPTIONS = '&page=1&include_adult=false'
const QUERY = `query=`

// Trying to fix according to answer

// from the docs
const colourOptions = [
  { label: 'blue', value: 'id1' },
  { label: 'red', value: 'id2' }
]
const filterColors = inputValue =>
  colourOptions.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  )
const promiseOptions = inputValue =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(filterColors(inputValue))
    }, 1000)
  })

export default class App extends Component {
  state = {
    selectedTitle: ''
  }

  searchTitles = movieTitle => {
    console.log('searching for', movieTitle)
    let searchTerm = movieTitle

    // FIX:
    //The default set of options to show before the user
    // starts searching. When set to true, the results for
    // loadOptions('') will be autoloaded.

    if (!movieTitle || movieTitle === ' ') {
      searchTerm = 'alien'
    }

    const urlRequest = `${SEARCH_URL}${NEW_API_KEY}${LANGUAGE}${QUERY}${searchTerm}${END_OPTIONS}`
    const newRequest = axios.get(urlRequest)

    if (newRequest) {
      // new promise: pending
      return newRequest.then(response => {
        // promise resolved : now I have the data, do a filter
        const compare = response.data.results.filter(i =>
          i.overview.toLowerCase().includes(movieTitle.toLowerCase())
        )
        // reurning the label for react-select baed on the title
        return compare.map(film => ({
          label: film.title,
          value: film.id
        }))
      })
    }
  }
  render() {
    return (
      <div className="App">
        <div style={{ margin: '30px' }}>
          In thix example, the options are always in drop down.
          <AsyncSelect
            // this is a example from the docs, it works
            cacheOptions
            defaultOptions
            loadOptions={promiseOptions}
          />
          <div class="ui pointing basic label">
            Enter "red" and open the menu again.{' '}
          </div>
        </div>

        <div style={{ margin: '30px' }}>
          Previous: In this example, using async to fetch the data, the options
          are cleared after selection.
          <div>
            Current: [Partially fixed] Now it is load with default options at
            least
          </div>
          <AsyncSelect
            // This is the example that the list was cleared (FIXED)
            cacheOptions
            defaultOptions
            value={this.state.selectedTitle}
            loadOptions={this.searchTitles}
            onChange={(property, value) => {
              console.log(property)
              this.setState({ selectedTitle: property })
            }}
          />
          <div class="ui pointing basic label">
            Enter "alien" and open the menu again.{' '}
          </div>
        </div>
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
