import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Alert,
  Badge,
  Card,
  Dimmer,
  Icon,
  Table
} from "tabler-react";
import { get_attendance_list_query_variables } from "./tools"

import CSLS from '../../../../../tools/cs_local_storage'
import ContentCard from "../../../../general/ContentCard"
import BadgeBookingStatus from "../../../../ui/BadgeBookingStatus"
import ButtonConfirm from '../../../../ui/ButtonConfirm'
import ScheduleClassAttendanceSearch from "./ScheduleClassAttendanceSearch"
import ScheduleClassAttendanceBase from "./ScheduleClassAttendanceBase"
import ScheduleClassAttendanceDelete from "./ScheduleClassAttendanceDelete"
import ScheduleClassAttendanceItemCheckinAndStatus from './ScheduleClassAttendanceItemCheckinAndStatus'
import { 
  GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, 
  RESEND_INFO_MAIL_SCHEDULE_ITEM_ATTENDANCE 
} from "./queries"


// function sleepFor(sleepDuration){
//   var now = new Date().getTime();
//   while(new Date().getTime() < now + sleepDuration){ /* Do nothing */ }
// }


function ScheduleClassAttendance({ t, match, location }) {
  const schedule_item_id = match.params.class_id
  const class_date = match.params.date
  const [attendanceRefetching, setAttendanceRefetching] = useState(false)
  const { loading, error, data, refetch, fetchMore } = useQuery(
    GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, {
      variables: get_attendance_list_query_variables(schedule_item_id, class_date),
      fetchPolicy: "network-only"
    }
  )
  const [ resendInfoMail ] = useMutation(RESEND_INFO_MAIL_SCHEDULE_ITEM_ATTENDANCE)

  // Inform account profile how to come back here using the back button
  // From attendance list to customer profile
  localStorage.setItem(CSLS.RELATIONS_ACCOUNT_PROFILE_RETURN, location.pathname)

  // Inform attendance registration components to come back here
  // From customer profile to attendance list
  localStorage.setItem(CSLS.SCHEDULE_CLASSES_BOOK_RETURN, location.pathname)

  // Loading
  if (loading) return <ScheduleClassAttendanceBase>
      <ContentCard cardTitle={t('general.attendance')}>
        <Dimmer loader={true} active={true} />
      </ContentCard>
  </ScheduleClassAttendanceBase>
  // Error
  if (error) {
    console.log(error)
    return <ScheduleClassAttendanceBase>{t('general.error_sad_smiley')}</ScheduleClassAttendanceBase>
  }
  
  const scheduleClass = data.scheduleClass
  console.log(scheduleClass)
  let checkedInIds = []
  data.scheduleItemAttendances.edges.map(({ node }) => (
    checkedInIds.push(node.account.id)
  ))

  const headerOptions = <Card.Options>
    <div className='float-right'>
      <Badge color="success">{scheduleClass.countAttending} {t("schedule.classes.class.attendance.attending")}</Badge> {" "}
      <Badge color="primary">{scheduleClass.countBooked} {t("schedule.classes.class.attendance.booked")}</Badge> {" "}
      {/* <Badge color="info">{t("general.spaces")}: {scheduleClass.spaces}</Badge>  */}
    </div>
  </Card.Options>


  return (
    <ScheduleClassAttendanceBase refetch={refetch}>
      {(scheduleClass.status === 'CANCELLED') ? 
        <Alert type="warning">
          <strong>{t("schedule.classes.class.attendance.this_class_is_cancelled")}</strong> - {" "}
          {t("schedule.classes.class.attendance.unable_to_add_attendance")}
        </Alert>  
        : 
        <ScheduleClassAttendanceSearch 
          checkedInIds={checkedInIds}
        />
      }
      <ContentCard 
        cardTitle={t('general.attendance')}
        pageInfo={data.scheduleItemAttendances.pageInfo}
        headerContent={headerOptions}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
          variables: {
            after: data.scheduleItemAttendances.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.scheduleItemAttendances.edges
            const pageInfo = fetchMoreResult.scheduleItemAttendances.pageInfo 

            return newEdges.length
              ? {
                  // Put the new scheduleItemAttendances at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  data: {
                    scheduleItemAttendances: {
                      __typename: previousResult.scheduleItemAttendances.__typename,
                      edges: [ ...previousResult.scheduleItemAttendances.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                }
              : previousResult
            }
          })
        }}>
        { !(data.scheduleItemAttendances.edges.length) ? 
          <Card.Body>
            <p>{t('schedule.classes.class.attendance.empty_list')}</p>
          </Card.Body>
          :
          <Dimmer active={attendanceRefetching} loader={true}>
            <Table cards>
              <Table.Header>
                <Table.Row key={v4()}>
                  <Table.ColHeader>{t('general.name')}</Table.ColHeader>
                  <Table.ColHeader>{t('general.booking_status')}</Table.ColHeader>
                  <Table.ColHeader></Table.ColHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.scheduleItemAttendances.edges.map(({ node }) => (
                    <Table.Row key={v4()}>
                      <Table.Col>
                        <Link to={`/relations/accounts/${node.account.id}/profile`}>
                          {node.account.fullName}
                        </Link>
                      </Table.Col>
                      <Table.Col>
                        <BadgeBookingStatus status={node.bookingStatus} />
                        <ButtonConfirm 
                              title={t("schedule.classes.class.attendance.confirm_resending_info_mail_title")}
                              msgConfirm={<p>{t("schedule.classes.class.attendance.confirm_resending_info_mail_to")}</p>}
                              msgDescription={<p><b>{node.account.fullName}</b></p>}
                              msgSuccess={t("schedule.classes.class.attendance.resend_success")}
                              actionFunction={resendInfoMail}
                              actionFunctionVariables={{variables: {input: {id: node.id}}}}
                              buttonClass="btn-link float-right"
                              buttonIcon={<Icon name="send" />}
                              buttonText={t("schedule.classes.class.attendance.resend_info_mail")}
                              buttonTextColor=""
                          />
                      </Table.Col>
                      <Table.Col>
                        {/* Delete */}
                        <ScheduleClassAttendanceDelete node={node} />
                        {/* Status dropdown */}
                        <ScheduleClassAttendanceItemCheckinAndStatus
                          setAttendanceRefetching={setAttendanceRefetching}
                          scheduleItemAttendanceNode={node}
                          refetchScheduleItemAttendance={true}
                        />
                      </Table.Col>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </Dimmer>
        }
      </ContentCard>
    </ScheduleClassAttendanceBase>
  )
}


export default withTranslation()(withRouter(ScheduleClassAttendance))
