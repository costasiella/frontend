import React, { useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Alert,
  Dropdown,
  Page,
  Grid,
  Icon,
  Dimmer,
  Badge,
  Button,
  Card,
  Container,
  Table
} from "tabler-react";
import SiteWrapper from "../../../../SiteWrapper"
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import { TimeStringToJSDateOBJ } from '../../../../../tools/date_tools'
// import { confirmAlert } from 'react-confirm-alert'; // Import
import { toast } from 'react-toastify'
import { getAccountsQueryVariables, getEnrollmentsListQueryVariables } from "./tools"

// import { classSubtitle } from "../tools"

import ClassEditBack from "../ClassEditBack"
import ClassEditMenu from "../ClassEditMenu"
import ContentCard from "../../../../general/ContentCard"
import InputSearch from "../../../../general/InputSearch"
// import ScheduleClassEnrollmentsDelete from "./ScheduleClassEnrollmentsDelete"
// import ClassEditBase from "../ClassEditBase"

import { GET_ACCOUNTS_QUERY } from "../../../../../queries/accounts/account_search_queries"
import { GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY } from "./queries"
import CSLS from "../../../../../tools/cs_local_storage"


function ScheduleClassEnrollments({ t, match, history }) {
  const subtitle = ''

  const [showSearch, setShowSearch] = useState(false)
  const return_url = "/schedule/classes/"
  const scheduleItemId = match.params.class_id
  const { refetch: refetchEnrollments, loading: queryEnrollmentsLoading, error: queryEnrollmentsError, data: queryEnrollmentsData } = useQuery(
    GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY, {
      variables: getEnrollmentsListQueryVariables(scheduleItemId)
    }
  )
  // const [ updateEnrollments, 
  //   { loading: mutationEnrollmentsLoading, error: mutationEnrollmentsError },
  // ] = useMutation(UPDATE_SCHEDULE_ITEM_ATTENDANCE)

  const [ getAccounts, 
         { refetch: refetchAccounts, 
           fetchMore: fetchMoreAccounts,
           loading: queryAccountsLoading, 
           error: queryAccountsError, 
           data: queryAccountsData 
         }] = useLazyQuery( GET_ACCOUNTS_QUERY )

  console.log('queryAccountsData')
  console.log(queryAccountsData)

  // const [createInvoice, { data }] = useMutation(CREATE_ACCOUNT_INVOICE, {
  //   // onCompleted = () => history.push('/finance/invoices/edit/')
  // }) 

  // Query
  // Loading
  if (queryEnrollmentsLoading) return <p>{t('general.loading_with_dots')}</p>
  // Error
  if (queryEnrollmentsError) {
    console.log(queryEnrollmentsError)
    return <p>{t('general.error_sad_smiley')}</p>
  }
  
  console.log(queryEnrollmentsData)
  let checkedInIds = []
  queryEnrollmentsData.scheduleItemEnrollments.edges.map(({ node }) => (
    checkedInIds.push(node.account.id)
  ))
  console.log(checkedInIds)

  const scheduleItem = queryEnrollmentsData.scheduleItem
  // const subtitle = classSubtitle({
  //   t: t,
  //   location: scheduleItem.organizationLocationRoom.organizationLocation.name, 
  //   locationRoom: scheduleItem.organizationLocationRoom.name,
  //   classtype: scheduleItem.organizationClasstype.name, 
  //   timeStart: TimeStringToJSDateOBJ(scheduleItem.timeStart), 
  //   date: classDate
  // })
  
  
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t('schedule.title')} subTitle={subtitle}>
            <div className="page-options d-flex">       
              <ClassEditBack />
              <InputSearch 
                initialValueKey={CSLS.SCHEDULE_CLASSES_CLASS_ENROLLMENTS_SEARCH}
                placeholder="Search..."
                onChange={(value) => {
                  console.log(value)
                  localStorage.setItem(CSLS.SCHEDULE_CLASSES_CLASS_ENROLLMENTS_SEARCH, value)
                  if (value) {
                    // {console.log('showSearch')}
                    // {console.log(showSearch)}
                    setShowSearch(true)
                    getAccounts({ variables: getAccountsQueryVariables()})
                  } else {
                    setShowSearch(false)
                  }
                }}
              />
            </div>
          </Page.Header>
          <Grid.Row>
              <Grid.Col md={9}>
                {/* Search results */}
                {(showSearch && (queryAccountsData) && (!queryAccountsLoading) && (!queryAccountsError)) ?
                  <ContentCard cardTitle={t('general.search_results')}
                              pageInfo={queryAccountsData.accounts.pageInfo}
                              onLoadMore={() => {
                                fetchMoreAccounts({
                                  variables: {
                                  after: queryAccountsData.accounts.pageInfo.endCursor
                                },
                                updateQuery: (previousResult, { fetchMoreResult }) => {
                                  const newEdges = fetchMoreResult.accounts.edges
                                  const pageInfo = fetchMoreResult.accounts.pageInfo 

                                  return newEdges.length
                                    ? {
                                        // Put the new accounts at the end of the list and update `pageInfo`
                                        // so we have the new `endCursor` and `hasNextPage` values
                                        queryAccountsData: {
                                          accounts: {
                                            __typename: previousResult.accounts.__typename,
                                            edges: [ ...previousResult.accounts.edges, ...newEdges ],
                                            pageInfo
                                          }
                                        }
                                      }
                                    : previousResult
                                }
                              })
                            }} >
                    { (!queryAccountsData.accounts.edges.length) ? 
                      t('schedule.classes.class.enrollments.search_result_empty') : 
                      <Table>
                        <Table.Header>
                          <Table.Row key={v4()}>
                            <Table.ColHeader>{t('general.name')}</Table.ColHeader>
                            <Table.ColHeader>{t('general.email')}</Table.ColHeader>
                            <Table.ColHeader></Table.ColHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {queryAccountsData.accounts.edges.map(({ node }) => (
                            <Table.Row key={v4()}>
                              <Table.Col key={v4()}>
                                {node.fullName}
                              </Table.Col>
                              <Table.Col key={v4()}>
                                {node.email}
                              </Table.Col>
                              <Table.Col key={v4()}>
                                Enroll button here
                              </Table.Col>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    }
                  </ContentCard>
                  : ""
                }
                {/* Enrollments */}
                <ContentCard cardTitle={t('general.enrollments')}
                             pageInfo={queryEnrollmentsData.scheduleItemEnrollments.pageInfo}
                             onLoadMore={() => {
                                fetchMoreAccounts({
                                variables: {
                                  after: queryEnrollmentsData.scheduleItemEnrollments.pageInfo.endCursor
                                },
                                updateQuery: (previousResult, { fetchMoreResult }) => {
                                  const newEdges = fetchMoreResult.scheduleItemEnrollments.edges
                                  const pageInfo = fetchMoreResult.scheduleItemEnrollments.pageInfo 

                                  return newEdges.length
                                    ? {
                                        // Put the new scheduleItemEnrollments at the end of the list and update `pageInfo`
                                        // so we have the new `endCursor` and `hasNextPage` values
                                        queryEnrollmentsData: {
                                          scheduleItemEnrollments: {
                                            __typename: previousResult.scheduleItemEnrollments.__typename,
                                            edges: [ ...previousResult.scheduleItemEnrollments.edges, ...newEdges ],
                                            pageInfo
                                          }
                                        }
                                      }
                                    : previousResult
                                }
                              })
                            }} >
                  <Table>
                    <Table.Header>
                      <Table.Row key={v4()}>
                        <Table.ColHeader>{t('general.name')}</Table.ColHeader>
                        <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
                        <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
                        <Table.ColHeader></Table.ColHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {queryEnrollmentsData.scheduleItemEnrollments.edges.map(({ node }) => (
                          <Table.Row key={v4()}>
                            <Table.Col>
                              {node.account.fullName}
                            </Table.Col>
                            <Table.Col>
                            </Table.Col>
                            <Table.Col>
                              {/* Edit */}
                              edit
                              {/* Delete */}
                              delete
                              {/* <ScheduleClassEnrollmentsDelete node={node} /> */}                            
                            </Table.Col>
                          </Table.Row>
                        ))}
                    </Table.Body>
                  </Table>
                </ContentCard>
              </Grid.Col>
              <Grid.Col md={3}>
                <ClassEditMenu 
                  scheduleItemId={scheduleItemId}
                  activeLink="enrollments"
                />
              </Grid.Col>
            </Grid.Row>
          </Container>
      </div>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(ScheduleClassEnrollments))
