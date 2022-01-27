import React, { useState, useContext } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Page,
  Grid,
  Icon,
  Button,
  Card,
  Dimmer,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import SiteWrapper from "../../../../SiteWrapper"
import AppSettingsContext from '../../../../context/AppSettingsContext'
import { getAccountsQueryVariables, getEnrollmentsListQueryVariables } from "./tools"

import ClassEditBack from "../ClassEditBack"
import ClassEditBase from "../ClassEditBase"
import ClassEditMenu from "../ClassEditMenu"
import ContentCard from "../../../../general/ContentCard"
import InputSearch from "../../../../general/InputSearch"
import ScheduleClassEnrollmentDelete from "./ScheduleClassEnrollmentDelete"
import ButtonAdd from '../../../../ui/ButtonAdd'
import ButtonEdit from '../../../../ui/ButtonEdit'
import { GET_ACCOUNTS_QUERY } from "../../../../../queries/accounts/account_search_queries"
import { GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY } from "./queries"
import CSLS from "../../../../../tools/cs_local_storage"


function ScheduleClassEnrollments({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  
  const [showCurrent, setShowCurrent] = useState(true)
  const scheduleItemId = match.params.class_id
  const subtitle = ''
  const cardTitle = t('general.enrollments')
  const menuActiveLink = "enrollments"
  const returnUrl = "/schedule/classes/"
  
  const { loading, error, data, refetch, fetchMore } = useQuery(
    GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY, {
      variables: getEnrollmentsListQueryVariables(scheduleItemId)
    }
  )

  const headerOptions = <Card.Options>
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
