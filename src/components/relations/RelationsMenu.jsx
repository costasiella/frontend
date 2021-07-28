// @flow

import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'

import {
  List
} from "tabler-react";
import HasPermissionWrapper from "../HasPermissionWrapper"


let accounts_active
let b2b_active
let suppliers_active


const RelationsMenu = ({ t, activeLink }) => (
    <List.Group transparent={true}>
        {(activeLink === 'accounts') ? accounts_active = true: accounts_active = false}
        {(activeLink === 'b2b') ? b2b_active = true: b2b_active = false}
        {(activeLink === 'suppliers') ? suppliers_active = true: suppliers_active = false}
        

        <List.GroupItem
          key={v4()}
          className="d-flex align-items-center"
          to="#/relations/accounts"
          icon="users"
          active={accounts_active}
        >
          {t('relations.accounts.title')}
        </List.GroupItem>
        {/* <HasPermissionWrapper 
          permission="view"
          resource="business">
          <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/relations/suppliers"
            icon="package"
            active={suppliers_active}
          >
            {t('relations.suppliers.title')}
          </List.GroupItem>
        </HasPermissionWrapper> */}
        <HasPermissionWrapper 
          permission="view"
          resource="business">
          <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/relations/b2b"
            icon="briefcase"
            active={b2b_active}
          >
            {t('relations.b2b.title')}
          </List.GroupItem>
        </HasPermissionWrapper>
    </List.Group>
);

export default withTranslation()(RelationsMenu)