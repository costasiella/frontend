import React from 'react'
import { useQuery } from "@apollo/client"

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
  
export default HasPermissionWrapper