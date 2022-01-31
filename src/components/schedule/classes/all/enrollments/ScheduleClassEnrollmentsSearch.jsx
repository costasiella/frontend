import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Icon,
  Button,
  Card,
  Dimmer,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import AppSettingsContext from '../../../../context/AppSettingsContext'
import { getAccountsQueryVariables } from "./tools"

import ClassEditBack from "../ClassEditBack"
import ClassEditBase from "../ClassEditBase"
import ButtonBack from '../../../../ui/ButtonBack'
import ContentCard from "../../../../general/ContentCard"
import InputSearch from "../../../../general/InputSearch"
import { GET_ACCOUNTS_QUERY } from "../../../../../queries/accounts/account_search_queries"


function ScheduleClassEnrollmentsSearch({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  let [searchName, setSearchName] = useState("")
  
  const scheduleItemId = match.params.class_id
  const cardTitle = t('schedule.classes.enrollments.search.title')
  const menuActiveLink = "enrollments"
  const returnUrl = `/schedule/classes/all/enrollments/${scheduleItemId}`
  
  const { loading, error, data, refetch, fetchMore } = useQuery(
    GET_ACCOUNTS_QUERY, {
      variables: getAccountsQueryVariables(searchName)
    }
  )

  const headerOptions = <Card.Options>
    <InputSearch 
      initialValueKey={searchName}
      placeholder="Search..."
      onChange={(value) => {
        console.log(value)
        if (value) {
          // {console.log('showSearch')}
          // {console.log(showSearch)}
          setSearchName(value)
          refetch({ variables: getAccountsQueryVariables(searchName)})
        } 
      }}
    />
  </Card.Options>

  const pageHeaderButtonList = <React.Fragment>
    <ButtonBack returnUrl={`/schedule/classes/all/enrollments/${scheduleItemId}`} />
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
        <p>{t('schedule.classes.enrollments.search.error_loading')}</p>
      </Card.Body>
    </ClassEditBase>
  )  

  console.log(data)
  const accounts = data.accounts

  // Empty list
  if (!accounts.edges.length) return (
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
          <p>{t('schedule.classes.enrollments.search.empty_list')}</p>
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
                   pageInfo={accounts.pageInfo}
                   hasCardBody={false}
                   headerContent={headerOptions}
                   onLoadMore={() => {
                      fetchMore({
                      variables: {
                        after: accounts.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.accounts.edges
                        const pageInfo = fetchMoreResult.accounts.pageInfo 

                        return newEdges.length
                          ? {
                              // Put the new scheduleItemEnrollments at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              queryEnrollmentsData: {
                                scheduleItemEnrollments: {
                                  __typename: previousResult.accounts.__typename,
                                  edges: [ ...previousResult.accounts.edges, ...newEdges ],
                                  pageInfo
                                }
                              }
                            }
                          : previousResult
                      }
                    })
                  }} 
      >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('general.email')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {accounts.edges.map(({ node }) => (
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
      </ContentCard>
    </ClassEditBase>
  )
}


export default withTranslation()(withRouter(ScheduleClassEnrollmentsSearch))
