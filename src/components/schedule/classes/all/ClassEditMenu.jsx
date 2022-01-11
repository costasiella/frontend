import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'


import {
  List
} from "tabler-react";
import HasPermissionWrapper from "../HasPermissionWrapper"

const ClassEditMenu = ({ t, activeLink, classId }) => (
    <List.Group transparent={true}>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to={"#/schedule/classes/all/edit/" + classId}
            icon="edit-3"
            active={activeLink === 'edit'}
            >
            {t('general.edit')}
        </List.GroupItem>
        <HasPermissionWrapper 
            resource="scheduleitemaccount"
            permission="view" 
        >
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to={"#/schedule/classes/all/instructors/" + classId}
              icon="users"
              active={activeLink === 'instructors'}
              >
              {t('general.instructors')}
          </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            resource="scheduleitemenrollment"
            permission="view" 
        >
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to={"#/schedule/classes/all/enrollments/" + classId}
              icon="users"
              active={activeLink === 'enrollments'}
              >
              {t('general.instructors')}
          </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            resource="scheduleitemprice"
            permission="view" 
        >
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to={"#/schedule/classes/all/prices/" + classId}
              icon="dollar-sign"
              active={activeLink === 'prices'}
              >
              {t('general.prices')}
          </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            resource="scheduleitemorganizationsubscriptiongroup"
            permission="view" 
        >
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to={"#/schedule/classes/all/subscriptions/" + classId}
              icon="edit"
              active={activeLink === 'subscriptions'}
              >
              {t('general.subscriptions')}
          </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            resource="scheduleitemorganizationclasspassgroup"
            permission="view" 
        >
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to={"#/schedule/classes/all/classpasses/" + classId}
              icon="credit-card"
              active={activeLink === 'classpasses'}
              >
              {t('general.classpasses')}
          </List.GroupItem>
        </HasPermissionWrapper>
    </List.Group>
);

export default withTranslation()(ClassEditMenu)


