// @flow

import React, { Component } from 'react'
import { t } from 'i18next'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { TimeStringToJSDateOBJ } from '../../../../tools/date_tools'

import {
  Page,
  Grid,
  Card,
  Container,
} from "tabler-react"
// import HasPermissionWrapper from "../../../../HasPermissionWrapper"

import { GET_CLASS_QUERY } from "../queries"

import ClassEditMenu from './ClassEditMenu'
import ClassEditBack from './ClassEditBack'
import ClassEditBaseBase from './ClassEditBaseBase'
import { class_edit_all_subtitle } from "./tools"


function ClassEditBase({t, match, children, menuActiveLink="", defaultCard=true, sidebarButton="", cardTitle=""}) {
  const classId = match.params.class_id
  const { loading, error, data } = useQuery(GET_CLASS_QUERY, { variables: {
    id: classId
  }})

  if (!cardTitle) {
    cardTitle = t('schedule.classes.title_edit')
  }

  if (loading) return (
    <ClassEditBaseBase 
      cardTitle={cardTitle}
      defaultCard={true}
      sidebarButton={sidebarButton}
      menuActiveLink={menuActiveLink}
    >
      <p>{t('general.loading_with_dots')}</p>
    </ClassEditBaseBase>
  )

  if (error) return (
    <ClassEditBaseBase 
      cardTitle={cardTitle}
      defaultCard={true}
      sidebarButton={sidebarButton}
      menuActiveLink={menuActiveLink}
    >
      {console.log(error)}
      <p>{t('general.error_sad_smiley')}</p>
    </ClassEditBaseBase>
  )

  console.log('query data')
  console.log(data)
  const initialValues = data.scheduleItem

  const initialTimeStart = TimeStringToJSDateOBJ(initialValues.timeStart)
  const subTitle = class_edit_all_subtitle({
    t: t,
    location: initialValues.organizationLocationRoom.organizationLocation.name,
    locationRoom: initialValues.organizationLocationRoom.name,
    classtype: initialValues.organizationClasstype.name,
    starttime: initialTimeStart
  })

  return (
    <ClassEditBaseBase 
      subTitle={subTitle}
      cardTitle={cardTitle}
      sidebarButton={sidebarButton}
      defaultCard={defaultCard}
      menuActiveLink={menuActiveLink}
    >
      {children}
    </ClassEditBaseBase>
  )

}

export default withTranslation()(withRouter(ClassEditBase))