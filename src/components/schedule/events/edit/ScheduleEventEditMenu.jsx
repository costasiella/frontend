import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import {
  List
} from "tabler-react";

import HasPermissionWrapper from "../../../HasPermissionWrapper"

const ScheduleEventMenu = ({ t, eventId, activeLink }) => (
  <List.Group transparent={true}>
    <HasPermissionWrapper 
        resource="scheduleevent"
        permission="change" 
    >
      <List.GroupItem
          key={v4()}
          className="d-flex align-items-center"
          to={`#/schedule/events/edit/${eventId}`}
          icon="edit-2"
          active={(activeLink === 'general')}
          >
          {t('schedule.events.edit.title')}
      </List.GroupItem>
    </HasPermissionWrapper>
    <HasPermissionWrapper 
        resource="scheduleeventticket"
        permission="view" 
    >
      <List.GroupItem
          key={v4()}
          className="d-flex align-items-center"
          to={`#/schedule/events/edit/${eventId}/tickets`}
          icon="clipboard"
          active={(activeLink === 'tickets')}
          >
          {t('schedule.events.tickets.title')}
      </List.GroupItem>
    </HasPermissionWrapper>
    <HasPermissionWrapper 
        resource="scheduleevent"
        permission="view" 
    >
      <List.GroupItem
          key={v4()}
          className="d-flex align-items-center"
          to={`#/schedule/events/edit/${eventId}/activities`}
          icon="calendar"
          active={(activeLink === 'activities')}
          >
          {t('schedule.events.activities.title')}
      </List.GroupItem>
    </HasPermissionWrapper>
    <HasPermissionWrapper 
        resource="scheduleeventmedia"
        permission="view" 
    >
      <List.GroupItem
          key={v4()}
          className="d-flex align-items-center"
          to={`#/schedule/events/edit/${eventId}/media`}
          icon="image"
          active={(activeLink === 'media')}
          >
          {t('schedule.events.media.title')}
      </List.GroupItem>
    </HasPermissionWrapper>
    <HasPermissionWrapper 
        resource="scheduleeventearlybird"
        permission="view" 
    >
      <List.GroupItem
          key={v4()}
          className="d-flex align-items-center"
          to={`#/schedule/events/edit/${eventId}/earlybirds`}
          icon="clock"
          active={(activeLink === 'earlybirds')}
          >
          {t('schedule.events.earlybirds.title')}
      </List.GroupItem>
    </HasPermissionWrapper>
    <HasPermissionWrapper 
        resource="scheduleeventsubscriptiongroupdiscount"
        permission="view" 
    >
      <List.GroupItem
          key={v4()}
          className="d-flex align-items-center"
          to={`#/schedule/events/edit/${eventId}/subscription_group_discounts`}
          icon="edit"
          active={(activeLink === 'subscription_group_discounts')}
          >
          {t('schedule.events.subscription_group_discounts.title')}
      </List.GroupItem>
    </HasPermissionWrapper>
  </List.Group>
);

export default withTranslation()(ScheduleEventMenu)