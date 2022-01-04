// @flow

import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"


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


const ScheduleShiftsFilter = ({ t, history, data, refetch }) => (
  <div>
    {/* Locations */}
    <select 
      className={selectClass}
      defaultValue={getDefaultValue(CSLS.SCHEDULE_SHIFTS_FILTER_LOCATION)}
      onChange={ (event) => {
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
    {/* Shifts */}
    <select 
      className={selectClass}
      defaultValue={getDefaultValue(CSLS.SCHEDULE_SHIFTS_FILTER_SHIFT)}
      onChange={ (event) => {
        updateLocalStorageAndRefetch(
          CSLS.SCHEDULE_SHIFTS_FILTER_SHIFT,
          event.target.value,
          refetch
        )
      }}
    >
      <option value="" key={v4()}>{t("schedule.shifts.filter_all_shifts")}</option>
      {data.organizationClasstypes.edges.map(({ node }) =>
        <option value={node.id} key={v4()}>{node.name}</option>
      )}
    </select>
  </div>
);

export default withTranslation()(withRouter(ScheduleShiftsFilter))