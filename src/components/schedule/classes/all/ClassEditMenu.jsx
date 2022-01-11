// @flow

import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'


import {
  List
} from "tabler-react";
// import HasPermissionWrapper from "../HasPermissionWrapper"

let edit_active
let classpasses_active
let subscriptions_active
let instructors_active
let prices_active

const ClassEditMenu = ({ t, activeLink, classId }) => (
    <List.Group transparent={true}>
        {(activeLink === 'edit') ? edit_active = true: edit_active = false}
        {(activeLink === 'classpasses') ? classpasses_active = true: classpasses_active = false}
        {(activeLink === 'subscriptions') ? subscriptions_active = true: subscriptions_active = false}
        {(activeLink === 'instructors') ? instructors_active = true: instructors_active = false}
        {(activeLink === 'prices') ? prices_active = true: prices_active = false}        

        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to={"#/schedule/classes/all/edit/" + classId}
            icon="edit-3"
            active={edit_active}
            >
            {t('general.edit')}
        </List.GroupItem>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to={"#/schedule/classes/all/instructors/" + classId}
            icon="users"
            active={instructors_active}
            >
            {t('general.instructors')}
        </List.GroupItem>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to={"#/schedule/classes/all/prices/" + classId}
            icon="dollar-sign"
            active={prices_active}
            >
            {t('general.prices')}
        </List.GroupItem>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to={"#/schedule/classes/all/subscriptions/" + classId}
            icon="edit"
            active={subscriptions_active}
            >
            {t('general.subscriptions')}
        </List.GroupItem>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to={"#/schedule/classes/all/classpasses/" + classId}
            icon="credit-card"
            active={classpasses_active}
            >
            {t('general.classpasses')}
        </List.GroupItem>
    </List.Group>
);

export default withTranslation()(ClassEditMenu)