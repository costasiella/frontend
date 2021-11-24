// @flow

import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'

import {
  List
} from "tabler-react";
import HasPermissionWrapper from "../HasPermissionWrapper"


let classpasses_active
let subscriptions_active
let revenue_active


const InsightMenu = ({ t, activeLink }) => (
    <List.Group transparent={true}>
        {(activeLink === 'classpasses') ? classpasses_active = true: classpasses_active = false}
        {(activeLink === 'subscriptions') ? subscriptions_active = true: subscriptions_active = false}
        {(activeLink === 'revenue') ? revenue_active = true: revenue_active = false}
        
        <HasPermissionWrapper 
            permission="view"
            resource="insight"
        >
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to="#/insight/classpasses"
              icon="credit-card"
              active={classpasses_active}
              >
              {t('insight.classpass.title')}
          </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="insight"
        >
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to="#/insight/subscriptions"
              icon="edit"
              active={subscriptions_active}
              >
              {t('insight.subscriptions.title')}
          </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="insight"
        >
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to="#/insight/revenue"
              icon="dollar-sign"
              active={revenue_active}
              >
              {t('insight.revenue.title')}
          </List.GroupItem>
        </HasPermissionWrapper>
        {/* <HasPermissionWrapper 
            permission="view"
            resource="organizationlocation">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to="#/organization/locations"
                icon="home"
                active={location_active}
                >
            Locations
            </List.GroupItem>
        </HasPermissionWrapper> */}
    </List.Group>
);

export default withTranslation()(InsightMenu)