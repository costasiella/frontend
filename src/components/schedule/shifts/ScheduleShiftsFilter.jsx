import React, { useState } from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Button, Grid,
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


function ScheduleShiftsFilter({ t, history, data, refetch }) {
  let [location, setLocation] = useState(getDefaultValue(CSLS.SCHEDULE_SHIFTS_FILTER_LOCATION))
  let [shift, setShift] = useState(getDefaultValue(CSLS.SCHEDULE_SHIFTS_FILTER_SHIFT))

  return (
    <React.Fragment>
      <Grid.Row>
        <Grid.Col md={12}>
          <Button
            className="float-right"
            color="link"
            size="sm"
            onClick={() => {
              localStorage.setItem(CSLS.SCHEDULE_SHIFTS_FILTER_LOCATION, "")
              localStorage.setItem(CSLS.SCHEDULE_SHIFTS_FILTER_SHIFT, "")
              setLocation("")
              setShift("")
              refetch(get_list_query_variables())
            }}
          >
            {t("general.clear")}
          </Button>
          <h6 className="mt-2 pt-1">{t("general.filter")}</h6 >
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col>
          {/* Locations */}
          <select 
            className={selectClass}
            value={location}
            onChange={ (event) => {
              setLocation(event.target.value)
              updateLocalStorageAndRefetch(
                CSLS.SCHEDULE_SHIFTS_FILTER_LOCATION,
                event.target.value,
                refetch
              )
            }}
          >
            <option value="" key={v4()}>{t("schedule.shifts.filter_all_locations")}</option>
            {data.organizationLocations.edges.map(({ node }) =>
              <option value={node.id} key={v4()}>{node.name}</option>
            )}
          </select>
        </Grid.Col>
        <Grid.Col>
          {/* Shifts */}
          <select 
            className={selectClass}
            value={shift}
            onChange={ (event) => {
              setShift(event.target.value)
              updateLocalStorageAndRefetch(
                CSLS.SCHEDULE_SHIFTS_FILTER_SHIFT,
                event.target.value,
                refetch
              )
            }}
          >
            <option value="" key={v4()}>{t("schedule.shifts.filter_all_shifts")}</option>
            {data.organizationShifts.edges.map(({ node }) =>
              <option value={node.id} key={v4()}>{node.name}</option>
            )}
          </select>
        </Grid.Col>
      </Grid.Row>
    </React.Fragment>
  )
}

export default withTranslation()(withRouter(ScheduleShiftsFilter))