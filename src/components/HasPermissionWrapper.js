import React, { Component } from 'react'
import { useQuery, Query } from "@apollo/client"

import GET_USER from '../queries/system/get_user'
import { get_all_permissions } from "../tools/user_tools"


function check_permission(permissions, permission, resource) {
  let you_shall_not_pass = true

  if (resource in permissions) {
    if (permissions[resource].has(permission)) {
      you_shall_not_pass = false
    }
  }
  
  return !you_shall_not_pass
}

function HasPermissionWrapper({permission, resource, children}) {
  const {loading, error, data} = useQuery(GET_USER)
  
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error loading user... :(</p>

  const permissions = get_all_permissions(data.user)

  if (check_permission(permissions, permission, resource)) {
    return children
  } else {
    return ''
  }
}

// class HasPermissionWrapper extends Component {
//   constructor(props) {
//     super(props)
//     // console.log("HasPermissionWrapper props:")
//     // console.log(props)
//   }

  
//   check_permission(permissions, permission, resource) {
//     let you_shall_not_pass = true

//     if (resource in permissions) {
//       if (permissions[resource].has(permission)) {
//         you_shall_not_pass = false
//       }
//     }
    
//     return !you_shall_not_pass
//   }

//   render() {
//     return (
//       <Query query={GET_USER} >

//         {({ loading, error, data }) => {
//           if (loading) return <p>Loading...</p>
//           if (error) return <p>Error loading user... :(</p>
          
//           // console.log(data)
//           const permissions = get_all_permissions(data.user)
//           // console.log('permissions:')
//           // console.log(permissions)

//           if (this.check_permission(permissions, this.props.permission, this.props.resource)) {
//             return this.props.children
//           } else {
//             return ''
//           }
//         }}

//       </Query>
//     )}
//   }
  
  export default HasPermissionWrapper