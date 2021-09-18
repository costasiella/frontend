import React from 'react'
import {
  ApolloClient,
  from,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
// import ApolloClient from "react"

import { TOKEN_REFRESH } from "./queries/system/auth"
// Import moment locale
// import moment from 'moment'
// import 'moment/locale/nl'

import CSLS from "./tools/cs_local_storage"
import CSEC from "./tools/cs_error_codes"
import { CSAuth } from './tools/authentication'

// Main app
import AppRoot from "./AppRoot"

// Tabler css 
import "tabler-react/dist/Tabler.css"
// React-datepicker css
import "react-datepicker/dist/react-datepicker.css"
// App css
import './App.css'

// Register "nl" locale for react-datepicker
// https://reactdatepicker.com/#example-17
// import { registerLocale } from "react-datepicker"
// import nl from 'date-fns/locale/nl';
// registerLocale('nl', nl);

// This allows <string>.trunc(x)
String.prototype.trunc = 
  function(n){
      return this.substr(0, n-1) + (this.length > n ? '...' : '')
  }

function SetCurrentUrlAsNext() {
  console.log("Storing current location as next in local storage")
  const currentUrl = window.location.href
  const next = currentUrl.split("#")[1]
  console.log(next)
  if ((next != "/user/login") && (next != "/user/session/expired") && (next != "/user/login/required")) {
    // This is a dirty hack to work around the following, a user refreshes the page but has an expired refreshtoken.
    // This will produce an error on the orinal component, setting the correct next URL in localStorage. However, 
    // the code below will move the user to /user/login, which will also error at first, thus /user/login always
    // gets set... we don't want that. This flow can be refactored at some point, but it works for now. 
    localStorage.setItem(CSLS.AUTH_LOGIN_NEXT, next)
  }
}
  

const errorLink = onError(({ graphQLErrors, networkError, operation, forward, response }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      )
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);

  // request size check
  if (graphQLErrors && graphQLErrors[0].message == "Request body exceeded settings.DATA_UPLOAD_MAX_MEMORY_SIZE.") {
    console.error('CHOSEN FILE EXCEEDS SIZE LIMIT')
  }

  // Token refresh check
  if (graphQLErrors && graphQLErrors[0].message == "Signature has expired") {
    console.log(graphQLErrors[0])
    console.log('Time to refresh the token')

    let authTokenExpired = false
    let refreshTokenExpired = false
    const tokenExp = localStorage.getItem(CSLS.AUTH_TOKEN_EXP)
    const refreshTokenExp = localStorage.getItem(CSLS.AUTH_REFRESH_TOKEN_EXP)

    if ((new Date() / 1000) >= tokenExp) {
      authTokenExpired = true
      
      if ((new Date() / 1000) >= refreshTokenExp) {
        refreshTokenExpired = true
        // Remove any remaining token data
        CSAuth.cleanup()
        // Store current location, user has to login again
        SetCurrentUrlAsNext()
      }
    }
    
    if (authTokenExpired && !refreshTokenExpired) {
      console.log("refresh token... somehow...")
      console.log(localStorage.getItem(CSLS.AUTH_REFRESH_TOKEN))

      return new Observable(observer => {
        client.mutate({
          mutation: TOKEN_REFRESH,
          variables: {
            refreshToken: localStorage.getItem(CSLS.AUTH_REFRESH_TOKEN)
          }
        })
          .then(({ data }) => { 
            console.log(data)
            CSAuth.updateTokenInfo(data.refreshToken)
          })
          .then(() => {
            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer)
            };

            // Retry last failed request
            forward(operation).subscribe(subscriber);
          })
          .catch(error => {
            // No refresh or client token available, we force user to login
            console.log("Failed to refresh the token, onwards to the login page")
            observer.error(error);
            window.location.href = "/#/user/login"
            window.location.reload()
          });
      })
    } else if (refreshTokenExpired) {
      window.location.href = "#/user/session/expired"
      window.location.reload()
    } else {
      window.location.href = "#/user/login/required"
      window.location.reload()
    }
  }
})
    

const httpLink = createHttpLink({
  uri: '/d/graphql/',
  credentials: 'same-origin',
});

const authLink = setContext(async (request, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(CSLS.AUTH_TOKEN)
  console.log(token)
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `JWT ${token}`: ''
    }
  }
});

// set up ApolloClient
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})


function App() {
  // Register "NL" locale for moment
  // moment.locale('en-US')

  return (
    <ApolloProvider client={client}>
      <AppRoot />
    </ApolloProvider>
  )
}

export default App

