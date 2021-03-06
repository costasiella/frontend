import React from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { TimeStringToJSDateOBJ } from '../../../../tools/date_tools'

// import HasPermissionWrapper from "../../../../HasPermissionWrapper"

import { GET_SHIFT_QUERY } from "../queries"

import ShiftEditBaseBase from './ShiftEditBaseBase'
import { shift_edit_all_subtitle } from "./tools"


function ShiftEditBase({t, match, children, menuActiveLink="", defaultCard=true, pageHeaderButtonList="", cardTitle=""}) {
  const shiftId = match.params.shift_id
  const { loading, error, data } = useQuery(GET_SHIFT_QUERY, { variables: {
    id: shiftId
  }})

  if (!cardTitle) {
    cardTitle = t('schedule.shifts.title_edit')
  }

  if (loading) return (
    <ShiftEditBaseBase 
      cardTitle={cardTitle}
      defaultCard={true}
      pageHeaderButtonList={pageHeaderButtonList}
      menuActiveLink={menuActiveLink}
    >
      <p>{t('general.loading_with_dots')}</p>
    </ShiftEditBaseBase>
  )

  if (error) return (
    <ShiftEditBaseBase 
      cardTitle={cardTitle}
      defaultCard={true}
      pageHeaderButtonList={pageHeaderButtonList}
      menuActiveLink={menuActiveLink}
    >
      {console.log(error)}
      <p>{t('general.error_sad_smiley')}</p>
    </ShiftEditBaseBase>
  )

  console.log('query data')
  console.log(data)
  const initialValues = data.scheduleItem

  const initialTimeStart = TimeStringToJSDateOBJ(initialValues.timeStart)
  const subTitle = shift_edit_all_subtitle({
    t: t,
    location: initialValues.organizationLocationRoom.organizationLocation.name,
    locationRoom: initialValues.organizationLocationRoom.name,
    shift: initialValues.organizationShift.name,
    starttime: initialTimeStart
  })

  return (
    <ShiftEditBaseBase 
      subTitle={subTitle}
      cardTitle={cardTitle}
      pageHeaderButtonList={pageHeaderButtonList}
      defaultCard={defaultCard}
      menuActiveLink={menuActiveLink}
    >
      {children}
    </ShiftEditBaseBase>
  )

}

export default withTranslation()(withRouter(ShiftEditBase))