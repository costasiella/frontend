import React, { useContext } from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'

import {
  Card,
  Dimmer,
  Icon,
  Table
} from "tabler-react";

import CSLS from '../../../../tools/cs_local_storage'
import { getWeekdayNames } from '../../../../tools/date_tools'
import AppSettingsContext from '../../../context/AppSettingsContext'
import ButtonAdd from '../../../ui/ButtonAdd'
import ButtonEdit from '../../../ui/ButtonEdit'
import ContentCard from "../../../general/ContentCard"
import AccountEnrollmentsBase from "./AccountEnrollmentsBase"
import RelationsAccountsBack from "../RelationsAccountsBack"
import ScheduleClassEnrollmentDelete from '../../../schedule/classes/all/enrollments/ScheduleClassEnrollmentDelete'
// import AccountClassDelete from "./AccountClassDelete"

import { GET_ACCOUNT_ENROLLMENTS_QUERY } from "./queries"


function AccountEnrollments({ t, match, location }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  const accountId = match.params.account_id
  const cardTitle = t('relations.account.enrollments.title')
  const weekdayNames = getWeekdayNames(t)
  const pageHeaderButtonList = <React.Fragment>
    <RelationsAccountsBack />
    <ButtonAdd addUrl={`/relations/accounts/${accountId}/enrollment_find_class`} className="ml-2" />
  </React.Fragment>

  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_ENROLLMENTS_QUERY, {
    variables: {'account': accountId},
    fetchPolicy: "network-only"
  })

  // Return here after adding an enrollment
  localStorage.setItem(CSLS.SCHEDULE_CLASSES_ENROLLMENT_RETURN, location.pathname)

  // Loading
  if (loading) return (
    <AccountEnrollmentsBase pageHeaderButtonList={pageHeaderButtonList} >
      <Card title={cardTitle}>
        <Card.Body>
          <Dimmer active={true} loader={true} />
        </Card.Body>
      </Card>
    </AccountEnrollmentsBase>
  )
  // Error
  if (error) {
    console.log(error)
    return (
      <AccountEnrollmentsBase pageHeaderButtonList={pageHeaderButtonList}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.error_sad_smiley')}</p>
          </Card.Body>
        </Card>
      </AccountEnrollmentsBase>
    )
  }

  const account = data.account
  const scheduleItemEnrollments = data.scheduleItemEnrollments
  
  // Empty list
  if (!scheduleItemEnrollments.edges.length) {
    return (
      <AccountEnrollmentsBase account={account} pageHeaderButtonList={pageHeaderButtonList}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('relations.account.enrollments.empty_list')}</p>
          </Card.Body>
        </Card>
      </AccountEnrollmentsBase>
    )
  }

  // Return populated list
  return (
    <AccountEnrollmentsBase account={account} pageHeaderButtonList={pageHeaderButtonList}>
      <ContentCard 
        cardTitle={cardTitle}
        pageInfo={scheduleItemEnrollments.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: scheduleItemEnrollments.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.scheduleItemEnrollments.edges
              const pageInfo = fetchMoreResult.scheduleItemEnrollments.pageInfo

              return newEdges.length
                ? {
                    // Put the new scheduleItemEnrollments at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    scheduleItemEnrollments: {
                      __typename: previousResult.scheduleItemEnrollments.__typename,
                      edges: [ ...previousResult.scheduleItemEnrollments.edges, ...newEdges ],
                      pageInfo
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
              <Table.ColHeader>{t('relations.account.enrollments.dateStart')}</Table.ColHeader>
              <Table.ColHeader>{t('relations.account.enrollments.dateEnd')}</Table.ColHeader>
              <Table.ColHeader>{t('general.class')}</Table.ColHeader>
              <Table.ColHeader>{t('general.subscription')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>  
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {scheduleItemEnrollments.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  { moment(node.dateStart).format(dateFormat) }
                </Table.Col>
                <Table.Col>
                  { (node.dateEnd) && moment(node.dateEnd).format(dateFormat) }
                </Table.Col>
                <Table.Col>
                  {/* TODO: add class time & weekday into here */}
                  { node.scheduleItem.organizationClasstype.name } <br />
                  <span className="text-muted">
                    <Icon name="clock" /> { weekdayNames[node.scheduleItem.frequencyInterval] } { moment(node.timeStart).format(timeFormat) } <br />
                    <Icon name="home" /> { node.scheduleItem.organizationLocationRoom.organizationLocation.name } {" - " } 
                    { node.scheduleItem.organizationLocationRoom.name }
                  </span> 
                </Table.Col>
                <Table.Col>
                  { node.accountSubscription.organizationSubscription.name } ({ moment(node.accountSubscription.dateStart).format(dateFormat) })
                </Table.Col>
                <Table.Col>
                  <ScheduleClassEnrollmentDelete node={node} />
                  <ButtonEdit className='float-right' editUrl={`/relations/accounts/${accountId}/enrollments/${node.id}`} />
                </Table.Col>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </AccountEnrollmentsBase>
  )
}

        
export default withTranslation()(withRouter(AccountEnrollments))