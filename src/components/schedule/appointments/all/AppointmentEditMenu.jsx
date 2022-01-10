// @flow

import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'


import {
  List
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"

let edit_active
let instructors_available_active

const AppointmentEditMenu = ({ t, activeLink, appointmentId }) => (
    <List.Group transparent={true}>
        {(activeLink === 'edit') ? edit_active = true: edit_active = false}
        {(activeLink === 'instructors_available') ? instructors_available_active = true: instructors_available_active = false}
        
        <HasPermissionWrapper
          resource="scheduleappointment"
          permission="change"
        >        
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to={"#/schedule/appointments/all/edit/" + appointmentId}
              icon="edit-3"
              active={edit_active}
              >
              {t('general.edit')}
          </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper
          resource="scheduleappointment"
          permission="change"
        >     
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to={"#/schedule/appointments/all/instructors_available/" + appointmentId}
              icon="users"
              active={instructors_available_active}
              >
              {t('general.instructors_available')}
          </List.GroupItem>
        </HasPermissionWrapper>
    </List.Group>
);

export default withTranslation()(AppointmentEditMenu)