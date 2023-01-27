import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'

import {
  Badge,
  Button,
  Card,
  Dimmer,
  Table
} from "tabler-react";

import CSLS from '../../../../../tools/cs_local_storage'
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import AppSettingsContext from '../../../../context/AppSettingsContext'
import { getEnrollmentsListQueryVariables } from "./tools"

import ClassEditBack from "../ClassEditBack"
import ClassEditBase from "../ClassEditBase"
import ContentCard from "../../../../general/ContentCard"
import ScheduleClassEnrollmentDelete from "./ScheduleClassEnrollmentDelete"
import ButtonAdd from '../../../../ui/ButtonAdd'
import ButtonEdit from '../../../../ui/ButtonEdit'
import { GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY } from "./queries"


function ScheduleClassEnrollments({ t, match, location }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  
  const [showCurrent, setShowCurrent] = useState(true)
  const scheduleItemId = match.params.class_id
  const cardTitle = t('general.enrollments')
  const menuActiveLink = "enrollments"
  
  const { loading, error, data, refetch, fetchMore } = useQuery(
    GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY, {
      variables: getEnrollmentsListQueryVariables(scheduleItemId)
    }
  )

  localStorage.setItem(CSLS.SCHEDULE_CLASSES_ENROLLMENT_RETURN, location.pathname)

//   const headerOptions = <Card.Options>
//   <div className='float-right'>
//     <Badge color="success">{scheduleClass.countAttending} {t("schedule.classes.class.attendance.attending")}</Badge> {" "}
//     <Badge color="primary">{scheduleClass.countBooked} {t("schedule.classes.class.attendance.booked")}</Badge> {" "}
//     {/* <Badge color="info">{t("general.spaces")}: {scheduleClass.spaces}</Badge>  */}
//   </div>
// </Card.Options>

  const ButtonAddEnrollment = <HasPermissionWrapper permission="add" resource="scheduleitemenrollment">
    <ButtonAdd addUrl={`/schedule/classes/all/enrollments/${scheduleItemId}/search`} className='ml-2' />
  </HasPermissionWrapper>

  const pageHeaderButtonList = <React.Fragment>
    <ClassEditBack />
    {ButtonAddEnrollment}
  </React.Fragment>

  // Loading
  if (loading) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <Dimmer active={true} loader={true} />
      </Card.Body>
    </ClassEditBase>
  )
  // Error
  if (error) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('schedule.classes.enrollments.error_loading')}</p>
      </Card.Body>
    </ClassEditBase>
  )  

  console.log(data)
  const scheduleItem = data.scheduleItem
  const enrollments = scheduleItem.enrollments
  const countEnrollments = enrollments.edges.length

  // Empty list
  if (!enrollments.edges.length) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      defaultCard={false}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <ContentCard cardTitle={cardTitle}
                   hasCardBody={false}
                   headerContent={headerOptions}
      >
        <Card.Body>
          <p>{t('schedule.classes.enrollments.empty_list')}</p>
        </Card.Body>
      </ContentCard>
    </ClassEditBase>
  )

  const headerOptions = <Card.Options>
    <div className='mr-2'>
      <Badge color="success">{countEnrollments} {t("schedule.classes.enrollments.enrolled")}</Badge> {" "}
      <Badge color="default">{scheduleItem.enrollmentSpaces - countEnrollments} {t("schedule.classes.enrollments.available_enrollment_spaces")}</Badge> {" "}
    </div>
    <Button color={(showCurrent) ? 'primary': 'secondary'}  
            size="sm"
            onClick={() => {
              setShowCurrent(true); 
              let queryVars = getEnrollmentsListQueryVariables(scheduleItemId)
              console.log(queryVars)
              refetch(queryVars); 
            }}
    >
      {t('general.current')}
    </Button>
    <Button color={(!showCurrent) ? 'primary': 'secondary'} 
            size="sm" 
            className="ml-2" 
            onClick={() => {
              setShowCurrent(false); 
              let queryVars = getEnrollmentsListQueryVariables(scheduleItemId, true)
              console.log(queryVars)
              refetch(queryVars); 
            }}
    >
      {t('general.ended')}
    </Button>
  </Card.Options>

  
  return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      defaultCard={false}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <ContentCard cardTitle={cardTitle}
                   pageInfo={enrollments.pageInfo}
                   hasCardBody={false}
                   headerContent={headerOptions}
                   onLoadMore={() => {
                      fetchMore({
                      variables: {
                        after: enrollments.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.scheduleItem.enrollments.edges
                        const pageInfo = fetchMoreResult.scheduleItem.enrollments.pageInfo 

                        return newEdges.length
                          ? {
                              // Put the new scheduleItemEnrollments at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              queryEnrollmentsData: {
                                scheduleItemEnrollments: {
                                  __typename: previousResult.scheduleItem.enrollments.__typename,
                                  edges: [ ...previousResult.scheduleItem.enrollments.edges, ...newEdges ],
                                  pageInfo
                                }
                              }
                            }
                          : previousResult
                      }
                    })
                  }} >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('general.subscription')}</Table.ColHeader>
              <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
              <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {enrollments.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col>
                    {node.accountSubscription.account.fullName}
                  </Table.Col>
                  <Table.Col>
                    {node.accountSubscription.organizationSubscription.name}
                  </Table.Col>
                  <Table.Col>
                    {moment(node.dateStart).format(dateFormat)}
                  </Table.Col>
                  <Table.Col>
                    {(node.dateEnd) ? moment(node.dateEnd).format(dateFormat) : ""}
                  </Table.Col>
                  <Table.Col className="text-right">
                    {/* Edit */}
                    <ButtonEdit editUrl={`/schedule/classes/all/enrollments/${scheduleItemId}/edit/${node.id}`} />
                    {/* Delete */}
                    <ScheduleClassEnrollmentDelete node={node} />
                    {/* <ScheduleClassEnrollmentsDelete node={node} /> */}                            
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </ClassEditBase>
  )
}


export default withTranslation()(withRouter(ScheduleClassEnrollments))
