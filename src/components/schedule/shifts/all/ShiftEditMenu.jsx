import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'


import {
  List
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"


const ShiftEditMenu = ({ t, activeLink, shiftId }) => (
  <List.Group transparent={true}>
    <List.GroupItem
      key={v4()}
      className="d-flex align-items-center"
      to={"#/schedule/shifts/all/edit/" + shiftId}
      icon="edit-3"
      active={(activeLink==="edit")}
      >
      {t('general.edit')}
    </List.GroupItem>
    <HasPermissionWrapper permission="view"
                          resource="scheduleitemaccount">
      <List.GroupItem
        key={v4()}
        className="d-flex align-items-center"
        to={"#/schedule/shifts/all/employees/" + shiftId}
        icon="users"
        active={activeLink==="employees"}
        >
        {t('general.employees')}
      </List.GroupItem>
    </HasPermissionWrapper>
  </List.Group>
);

export default withTranslation()(ShiftEditMenu)