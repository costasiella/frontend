import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Button,
  Card,
  Dimmer,
  Dropdown,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import { toast } from 'react-toastify'
import { get_attendance_list_query_variables } from "./tools"

import ContentCard from "../../../../general/ContentCard"
import BadgeBookingStatus from "../../../../ui/BadgeBookingStatus"
import ScheduleClassAttendanceSearch from "./ScheduleClassAttendanceSearch"
import ScheduleClassAttendanceBase from "./ScheduleClassAttendanceBase"
import ScheduleClassAttendanceDelete from "./ScheduleClassAttendanceDelete"
import { GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, UPDATE_SCHEDULE_ITEM_ATTENDANCE } from "./queries"


function setAttendanceStatus({t, match, updateAttendance, node, status}) {
  const schedule_item_id = match.params.class_id
  const class_date = match.params.date

  updateAttendance({
    variables: { 
      input: {
        id: node.id, 
        bookingStatus: status
      }
    },
    refetchQueries: [
      {query: GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, 
        variables: get_attendance_list_query_variables(schedule_item_id, class_date)}
    ]
  }).then(({ data }) => {
    console.log('got data', data);
    toast.success(
      t('schedule.classes.class.attendance.status_saved'), {
        position: toast.POSITION.BOTTOM_RIGHT
      })
  }).catch((error) => {
    toast.error((t('general.toast_server_error')) +  error, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    console.log('there was an error sending the query', error);
  })
}


function ScheduleClassAttendance({ t, match, history }) {
  const schedule_item_id = match.params.class_id
  const class_date = match.params.date
  const { loading, error, data, fetchMore } = useQuery(
    GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, {
      variables: get_attendance_list_query_variables(schedule_item_id, class_date)
    }
  )
  const [ updateAttendance ] = useMutation(UPDATE_SCHEDULE_ITEM_ATTENDANCE)

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
  
  let checkedInIds = []
  data.scheduleItemAttendances.edges.map(({ node }) => (
    checkedInIds.push(node.account.id)
  ))

  return (
    <ScheduleClassAttendanceBase>
      <ScheduleClassAttendanceSearch 
        checkedInIds={checkedInIds}
      />
      <ContentCard 
        cardTitle={t('general.attendance')}
        pageInfo={data.scheduleItemAttendances.pageInfo}
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
                      {node.account.fullName}
                    </Table.Col>
                    <Table.Col>
                      <BadgeBookingStatus status={node.bookingStatus} />
                    </Table.Col>
                    <Table.Col>
                      {/* Delete */}
                      <ScheduleClassAttendanceDelete node={node} />
                      {/* Status dropdown */}
                      <Dropdown
                        key={v4()}
                        className="pull-right"
                        type="button"
                        toggle
                        color="secondary btn-sm"
                        triggerContent={t("general.status")}
                        items={[
                          // <HasPermissionWrapper key={v4()} permission="change" resource="scheduleitemattendance">
                          //   <Dropdown.Item
                          //     key={v4()}
                          //     icon="check"
                          //     onClick={() => {
                          //       setAttendanceStatus({
                          //         t: t, 
                          //         updateAttendance: updateAttendance,
                          //         node: node,
                          //         status: 'ATTENDING'
                          //       })
                          //       refetchAttendance()
                          //     }}>
                          //       {t('schedule.classes.class.attendance.booking_status.ATTENDING')}
                          //   </Dropdown.Item>
                          // </HasPermissionWrapper>,
                          <HasPermissionWrapper key={v4()} permission="change" resource="scheduleitemattendance">
                            <Dropdown.Item
                              key={v4()}
                              icon="calendar"
                              onClick={() => {
                                setAttendanceStatus({
                                  t: t, 
                                  match: match,
                                  updateAttendance: updateAttendance,
                                  node: node,
                                  status: 'BOOKED'
                                })
                              }}>
                                {t('schedule.classes.class.attendance.booking_status.BOOKED')}
                            </Dropdown.Item>
                          </HasPermissionWrapper>,
                          <HasPermissionWrapper key={v4()} permission="change" resource="scheduleitemattendance">
                            <Dropdown.Item
                              key={v4()}
                              icon="x"
                              onClick={() => {
                                setAttendanceStatus({
                                  t: t, 
                                  match: match,
                                  updateAttendance: updateAttendance,
                                  node: node,
                                  status: 'CANCELLED'
                                })
                              }}>
                                {t('schedule.classes.class.attendance.booking_status.CANCELLED')}
                            </Dropdown.Item>
                          </HasPermissionWrapper>,
                        ]}
                      />
                      {(node.bookingStatus === "BOOKED") ?
                        <HasPermissionWrapper key={v4()} permission="change" resource="scheduleitemattendance">
                          <Button
                            key={v4()}
                            className="pull-right"
                            color="success"
                            size="sm"
                            onClick={() => {
                              setAttendanceStatus({
                                t: t, 
                                match: match,
                                updateAttendance: updateAttendance,
                                node: node,
                                status: 'ATTENDING'
                              })
                            }}>
                              {t('general.checkin')}
                          </Button>
                        </HasPermissionWrapper>  : "" }
                    </Table.Col>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        }
      </ContentCard>
    </ScheduleClassAttendanceBase>
  )
}


export default withTranslation()(withRouter(ScheduleClassAttendance))
