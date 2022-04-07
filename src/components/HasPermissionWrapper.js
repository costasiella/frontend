import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'

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

function HasPermissionWrapper({t, permission, resource, children, hideLoading=false}) {
  const {loading, error, data} = useQuery(GET_USER)

  if (loading) {
    if (!hideLoading) {
      return <p>{t("general.loading_with_dots")}</p>
    } else {
      return ""
    }
  } 
  if (error) return <p>Error loading user... :(</p>

  const permissions = get_all_permissions(data.user)

  if (check_permission(permissions, permission, resource)) {
    return children
  } else {
    return ''
  }
}
  
export default withTranslation()(HasPermissionWrapper)