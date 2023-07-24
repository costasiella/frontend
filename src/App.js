import React from 'react'
import {
  ApolloClient,
  ApolloLink,
  from,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  Observable,
} from "@apollo/client";

import { relayStylePagination } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
// import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';

import { TOKEN_REFRESH } from "./queries/system/auth"

import CSEC from "./tools/cs_error_codes"
import CSLS from "./tools/cs_local_storage"
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
// eslint-disable-next-line no-extend-native
String.prototype.trunc = 
  function(n){
      return this.substr(0, n-1) + (this.length > n ? '...' : '')
  }

function SetCurrentUrlAsNext() {
  console.log("Storing current location as next in local storage")
  const currentUrl = window.location.href
  const next = currentUrl.split("#")[1]
  console.log(next)
  if ((next !== "/user/login") && (next !== "/user/session/expired") && (next !== "/user/login/required") && (next)) {
    // This is a dirty hack to work around the following, a user refreshes the page but has an expired refreshtoken.
    // This will produce an error on the orinal component, setting the correct next URL in localStorage. However, 
    // the code below will move the user to /user/login, which will also error at first, thus /user/login always
    // gets set... we don't want that. This flow can be refactored at some point, but it works for now. 
    localStorage.setItem(CSLS.AUTH_LOGIN_NEXT, next)
  } 
}


let refreshingToken = false

const errorLink = onError(({ graphQLErrors, networkError, operation, forward, response }) => {
  console.log(operation)
  console.log(response)

  let user_not_logged_in_within_graphql_errors = false
  let user_not_logged_in_within_response_errors = false
  
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      )
      // Catch broken promises (Check needed since django-graphene 3.0.0b8)
      // Instead of adding a graphql error, there's a broken promise on an exception raised.
      // if (message.includes(CSEC.USER_NOT_LOGGED_IN)) {
      //   user_not_logged_in_within_graphql_errors = true
      // }
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);

  // request size check
  if (graphQLErrors && graphQLErrors[0].message === "Request body exceeded settings.DATA_UPLOAD_MAX_MEMORY_SIZE.") {
    console.error('CHOSEN FILE EXCEEDS SIZE LIMIT')
  }

  // Catch errors in response
  if (response) {
    let i
    for (i = 0; i < response.errors.length; i++) {
      if (response.errors[i].extensions && response.errors[i].extensions.code === CSEC.USER_NOT_LOGGED_IN) {
        user_not_logged_in_within_response_errors = true
      }
    }
  }

  // Catch expired tokens on refresh

  // These two ifs look silly, but hear me out...
  // Both errors might be triggered at the same time, both within the GraphQL erros and the response.
  // Some logic is required to prevent running the refresh more than once. 
  // As that might cause it to run with an invalid refresh token and fail, 
  // causing the user to be signed out, even though a valid token will arrive a tiny bit later.
  // So here we have two conditions, that both inform the refresh function that the token is being refreshed
  // To prevent the race condition mentioned above.
  if (user_not_logged_in_within_response_errors) {
    console.log('Time to refresh the token')
    refreshToken(forward, operation)
    refreshingToken = true
  }

  if (user_not_logged_in_within_graphql_errors) {
    console.log('Time to refresh the token')
    refreshToken(forward, operation)
    refreshingToken = true
  }
})


// Actually try to refresh the token
function refreshToken(forward, operation) {
  if (!refreshingToken) {
    console.log("Start token refresh...")

    return new Observable(observer => {
      client.mutate({
        mutation: TOKEN_REFRESH,
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

          // Token is no longer refreshing
          refreshingToken = false

          // Retry last failed request
          forward(operation).subscribe(subscriber);
        })
        .catch(error => {
          // No refresh or client token available, we request user to login, after a cleanup
          console.error("Error refreshing token!")
          console.error(error);
          observer.error(error);

          CSAuth.cleanup()
          SetCurrentUrlAsNext()

          refreshingToken = false

          // console.warn("Would set location to user login")
          window.location.href = "/#/user/login"
          setTimeout(function() {
            window.location.reload()
          }, 100)
        });
    })
  } else if (refreshingToken) {
    console.log("Token already refreshing...")
  }
}

   
// // Fetch CSRF Token
// let csrftoken
// async function getCsrfToken() {
//   if (csrftoken) return csrftoken

//   csrftoken = await fetch('/d/csrf/')
//     .then(response => response.json())
//     .then(data => data.csrfToken)

//   return await csrftoken
// }

// Fetch CSRF Token from Cookie
let csrftoken
async function getCsrfToken() {
  if (csrftoken) return csrftoken

  await fetch('/d/csrf/')
    .then(response => response.json())

  // For troubleshooting
  // const result =  await fetch('/d/csrf/')
  //   .then(response => response.json())
  // console.log(reuslt)

  csrftoken = Cookies.get('csrftoken');
  
  return await csrftoken
}

const httpLink = createHttpLink({
  uri: '/d/graphql/',
  credentials: 'same-origin',
  // request: async (operation) => {
  //   const csrftoken = await getCsrfToken();
  //   Cookies.set('csrftoken', csrftoken);
  //   // set the cookie 'csrftoken'
  //   operation.setContext({
  //       // set the 'X-CSRFToken' header to the csrftoken
  //       headers: {
  //           'X-CSRFToken': csrftoken,
  //       },
  //   })}
});

const csrfMiddleware = new ApolloLink(async (operation, forward) => {
  const csrftoken = await getCsrfToken();
  Cookies.set('csrftoken', csrftoken);

  operation.setContext({
    // set the 'X-CSRFToken' header to the csrftoken
    headers: {
        'X-CSRFToken': csrftoken,
    },
  })

  return forward(operation)
})

// const authLink = setContext(async (request, { headers }) => {
//   // get the authentication token from local storage if it exists
//   // const token = localStorage.getItem(CSLS.AUTH_TOKEN)
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       // Authorization: token ? `JWT ${token}`: ''
//     }
//   }
// });

// set up ApolloClient
const client = new ApolloClient({
  link: from([csrfMiddleware, errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          accounts: relayStylePagination(),
        },
      },
    },
  }),
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

