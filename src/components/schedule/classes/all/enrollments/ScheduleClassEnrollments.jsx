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
  Container,
  Table
} from "tabler-react";
import SiteWrapper from "../../../../SiteWrapper"
import AppSettingsContext from '../../../../context/AppSettingsContext'
import { getAccountsQueryVariables, getEnrollmentsListQueryVariables } from "./tools"

import ClassEditBack from "../ClassEditBack"
import ClassEditMenu from "../ClassEditMenu"
import ContentCard from "../../../../general/ContentCard"
import InputSearch from "../../../../general/InputSearch"
import ScheduleClassEnrollmentDelete from "./ScheduleClassEnrollmentDelete"
import ButtonEdit from '../../../../ui/ButtonEdit'
import { GET_ACCOUNTS_QUERY } from "../../../../../queries/accounts/account_search_queries"
import { GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY } from "./queries"
import CSLS from "../../../../../tools/cs_local_storage"


function ScheduleClassEnrollments({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  
  const subtitle = ''
  const [showCurrent, setShowCurrent] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const returnUrl = "/schedule/classes/"
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

  const headerOptions = <Card.Options>
    <Button color={(showCurrent) ? 'primary': 'secondary'}  
            size="sm"
            onClick={() => {
              setShowCurrent(true); 
              let queryVars = getEnrollmentsListQueryVariables(scheduleItemId)
              console.log(queryVars)
              refetchEnrollments(queryVars); 
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
              refetchEnrollments(queryVars); 
            }}
    >
      {t('general.ended')}
    </Button>
  </Card.Options>

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
  
  // console.log(queryEnrollmentsData)
  // let checkedInIds = []
  // enrollments.edges.map(({ node }) => (
  //   checkedInIds.push(node.account.id)
  // ))
  // console.log(checkedInIds)

  console.log(queryEnrollmentsData)
  const scheduleItem = queryEnrollmentsData.scheduleItem
  const enrollments = scheduleItem.enrollments
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
              <ClassEditBack className={'mr-2'} />
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
                              hasCardBody={false}
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
                      <Card.Body>{t('schedule.classes.class.enrollments.search_result_empty')}</Card.Body> : 
                      <Table cards>
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
                              <Table.Col className="text-right" key={v4()}>
                                <Link to={`/schedule/classes/all/enrollments/${scheduleItemId}/options/${node.id}`}>
                                  <Button color="secondary">
                                    {t("general.enroll")} <Icon name="chevron-right" />
                                  </Button>
                                </Link>
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
                             pageInfo={enrollments.pageInfo}
                             hasCardBody={false}
                             headerContent={headerOptions}
                             onLoadMore={() => {
                                fetchMoreAccounts({
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
