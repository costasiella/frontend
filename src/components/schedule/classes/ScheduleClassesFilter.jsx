import React, { useState } from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Button,
  Grid,
} from "tabler-react";

import CSLS from "../../../tools/cs_local_storage"
import { get_list_query_variables } from './tools'


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


function ScheduleClassesFilter({ t, history, data, refetch }) {
  let [location, setLocation] = useState(getDefaultValue(CSLS.SCHEDULE_CLASSES_FILTER_LOCATION))
  let [classtype, setClasstype] = useState(getDefaultValue(CSLS.SCHEDULE_CLASSES_FILTER_CLASSTYPE))
  let [level, setLevel] = useState(getDefaultValue(CSLS.SCHEDULE_CLASSES_FILTER_LEVEL))

  return (
    <div className="mb-4">
      <Grid.Row>
        <Grid.Col md={12}>
          <Button
            className="float-right"
            color="link"
            size="sm"
            onClick={() => {
              localStorage.setItem(CSLS.SCHEDULE_CLASSES_FILTER_CLASSTYPE, "")
              localStorage.setItem(CSLS.SCHEDULE_CLASSES_FILTER_LEVEL, "")
              localStorage.setItem(CSLS.SCHEDULE_CLASSES_FILTER_LOCATION, "")
              setLocation("")
              setClasstype("")
              setLevel("")
              refetch(get_list_query_variables())
            }}
          >
            {t("general.reset_filter")}
          </Button>
          <h6 className="mt-2 pt-1">{t("general.filter")}</h6>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col xs={12}>
          {/* Locations */}
          <select 
            className={selectClass}
            value={location}
            onChange={ (event) => {
              setLocation(event.target.value)
              updateLocalStorageAndRefetch(
                CSLS.SCHEDULE_CLASSES_FILTER_LOCATION,
                event.target.value,
                refetch
              )
            }}
          >
            <option value="" key={v4()}>{t("schedule.classes.filter_all_locations")}</option>
            {data.organizationLocations.edges.map(({ node }) =>
              <option value={node.id} key={v4()}>{node.name}</option>
            )}
          </select>
        </Grid.Col>
        <Grid.Col xs={12}>
          {/* Classtypes */}
          <select 
            className={selectClass}
            value={classtype}
            onChange={ (event) => {
              setClasstype(event.target.value)
              updateLocalStorageAndRefetch(
                CSLS.SCHEDULE_CLASSES_FILTER_CLASSTYPE,
                event.target.value,
                refetch
              )
            }}
          >
            <option value="" key={v4()}>{t("schedule.classes.filter_all_classtypes")}</option>
            {data.organizationClasstypes.edges.map(({ node }) =>
              <option value={node.id} key={v4()}>{node.name}</option>
            )}
          </select>
        </Grid.Col>
        <Grid.Col xs={12}>
          {/* Levels */}
          <select 
            className={selectClass}
            value={level}
            onChange={ (event) => {
              setLevel(event.target.value)
              updateLocalStorageAndRefetch(
                CSLS.SCHEDULE_CLASSES_FILTER_LEVEL,
                event.target.value,
                refetch
              )
            }}
          >
            <option value="" key={v4()}>{t("schedule.classes.filter_all_levels")}</option>
            {data.organizationLevels.edges.map(({ node }) =>
              <option value={node.id} key={v4()}>{node.name}</option>
            )}
          </select>
        </Grid.Col>
      </Grid.Row>
    </div>
  )
}

export default withTranslation()(withRouter(ScheduleClassesFilter))