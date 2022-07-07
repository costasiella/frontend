import React from 'react'
import moment from 'moment'
import {
  Icon,
} from "tabler-react"

export function DisplayClassInfo({
  t, 
  classDate, 
  classData,
  dateFormat,
  timeFormat,
  showTimeEnd,
}) {
    return (
      <>
        <h6>{classData.organizationClasstype.name}</h6>
        <Icon name="clock" /> { moment(classDate).format(dateFormat) } { " " }
        <span className="text-muted">
          {moment(classDate + ' ' + classData.timeStart).format(timeFormat)} 
          {(showTimeEnd) && <>{ " - " }{moment(classDate + ' ' + classData.timeEnd).format(timeFormat)}</>}
        </span><br />
        <Icon name="home" /> { classData.organizationLocationRoom.organizationLocation.name } { " " }
        <span className="text-muted">
          { classData.organizationLocationRoom.name }
        </span> 
      </>
      // <div>
      //   <b>
      //     {moment(classDate).format(dateFormat)} {' '}
      //     {moment(TimeStringToJSDateOBJ(classData.scheduleClass.timeStart)).format(timeFormat)} {' - '}
      //     {moment(TimeStringToJSDateOBJ(classData.scheduleClass.timeEnd)).format(timeFormat)} <br />  
      //   </b>
      //   {classData.scheduleClass.organizationClasstype.name + " " + t("general.at") + ' ' + 
      //     classData.scheduleClass.organizationLocationRoom.organizationLocation.name}
      // </div>
    )
}