import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import CSLS from "../../../../tools/cs_local_storage"
import { get_list_query_variables } from './tools'

import { 
  Grid,
} from "tabler-react";



function getDefaultValue(value) {
  let defaultValue = localStorage.getItem(value)
  if (defaultValue) {
    return defaultValue
  } else {
    return ""
  }
}


function updateLocalStorageAndRefetch(key, value, refetch) {
  localStorage.setItem(key, value)
  refetch(get_list_query_variables())

}

const selectClass = "form-control custom-select mb-2"

const ShopClassesScheduleFilter = ({ t, history, data, refetch }) => (
  <Grid.Row>
    <Grid.Col xs={12} sm={12} md={3}>
      {/* Locations */}
      <select 
        className={selectClass}
        defaultValue={getDefaultValue(CSLS.SHOP_CLASSES_FILTER_LOCATION)}
        onChange={ (event) => {
          updateLocalStorageAndRefetch(
            CSLS.SHOP_CLASSES_FILTER_LOCATION,
            event.target.value,
            refetch
          )
        }}
      >
        <option value="" key={v4()}>{t("shop.classes.filter_all_locations")}</option>
        {data.organizationLocations.edges.map(({ node }) =>
          <option value={node.id} key={v4()}>{node.name}</option>
        )}
      </select>
    </Grid.Col>
    <Grid.Col xs={12} sm={12} md={3}>
      {/* Classtypes */}
      <select 
        className={selectClass}
        defaultValue={getDefaultValue(CSLS.SHOP_CLASSES_FILTER_CLASSTYPE)}
        onChange={ (event) => {
          updateLocalStorageAndRefetch(
            CSLS.SHOP_CLASSES_FILTER_CLASSTYPE,
            event.target.value,
            refetch
          )
        }}
      >
        <option value="" key={v4()}>{t("shop.classes.filter_all_classtypes")}</option>
        {data.organizationClasstypes.edges.map(({ node }) =>
          <option value={node.id} key={v4()}>{node.name}</option>
        )}
      </select>
    </Grid.Col>
    <Grid.Col xs={12} sm={12} md={3}>
          {/* Instructors */}
          <select 
            className={selectClass}
            defaultValue={getDefaultValue(CSLS.SHOP_CLASSES_FILTER_INSTRUCTOR)}
            onChange={ (event) => {
              updateLocalStorageAndRefetch(
                CSLS.SHOP_CLASSES_FILTER_INSTRUCTOR,
                event.target.value,
                refetch
              )
            }}
          >
            <option value="" key={v4()}>{t("shop.classes.filter_all_instructors")}</option>
            {data.instructors.edges.map(({ node }) =>
              <option value={node.id} key={v4()}>{node.fullName}</option>
            )}
          </select>
        </Grid.Col>
    <Grid.Col xs={12} sm={12} md={3}>
      {/* Levels */}
      <select 
        className={selectClass}
        defaultValue={getDefaultValue(CSLS.SHOP_CLASSES_FILTER_LEVEL)}
        onChange={ (event) => {
          updateLocalStorageAndRefetch(
            CSLS.SHOP_CLASSES_FILTER_LEVEL,
            event.target.value,
            refetch
          )
        }}
      >
        <option value="" key={v4()}>{t("shop.classes.filter_all_levels")}</option>
        {data.organizationLevels.edges.map(({ node }) =>
          <option value={node.id} key={v4()}>{node.name}</option>
        )}
      </select>
    </Grid.Col>
  </Grid.Row>
);

export default withTranslation()(withRouter(ShopClassesScheduleFilter))