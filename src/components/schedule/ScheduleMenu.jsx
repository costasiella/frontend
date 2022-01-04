// @flow

import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'


import {
  List
} from "tabler-react";
import HasPermissionWrapper from "../HasPermissionWrapper"


const ScheduleMenu = ({ t, activeLink }) => (
  <List.Group transparent={true}>
    <HasPermissionWrapper 
        resource="scheduleclass"
        permission="view" 
    >
      <List.GroupItem
          key={v4()}
          className="d-flex align-items-center"
          to="#/schedule/classes"
          icon="book"
          active={(activeLink === 'classes')}
          >
          {t('schedule.classes.title')}
      </List.GroupItem>
    </HasPermissionWrapper>
    <HasPermissionWrapper 
        resource="scheduleevent"
        permission="view" 
    >
      <List.GroupItem
          key={v4()}
          className="d-flex align-items-center"
          to="#/schedule/events"
          icon="clipboard"
          active={(activeLink === 'events')}
          >
          {t('schedule.events.title')}
      </List.GroupItem>
    </HasPermissionWrapper>
    <HasPermissionWrapper 
        resource="scheduleshift"
        permission="view" 
    >
      <List.GroupItem
          key={v4()}
          className="d-flex align-items-center"
          to="#/schedule/shifts"
          icon="clock"
          active={(activeLink === 'shifts')}
          >
          {t('schedule.shifts.title')}
      </List.GroupItem>
    </HasPermissionWrapper>
    {/* <HasPermissionWrapper 
        resource="scheduleappointment"
        permission="view" 
    >
      <List.GroupItem
          key={v4()}
          className="d-flex align-items-center"
          to="#/schedule/appointments"
          icon="calendar"
          active={appointments_active}
          >
          {t('schedule.appointments.title')}
      </List.GroupItem>
    </HasPermissionWrapper> */}
  </List.Group>
);

export default withTranslation()(ScheduleMenu)