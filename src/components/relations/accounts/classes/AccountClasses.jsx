import React, { useContext } from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'

import {
  Card,
  Table
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'
import BadgeBookingStatus from "../../../ui/BadgeBookingStatus"
import ContentCard from "../../../general/ContentCard"
import AccountClassesBase from "./AccountClassesBase"
import AccountClassDelete from "./AccountClassDelete"

import { GET_ACCOUNT_CLASSES_QUERY } from "./queries"


function AccountClasses({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  const account_id = match.params.account_id
  const cardTitle = t('relations.account.classes.title')
  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_CLASSES_QUERY, {
    variables: {'account': account_id},
    fetchPolicy: "network-only"
  })

  // Loading
  if (loading) return (
    <AccountClassesBase>
      <Card title={cardTitle}>
        <Card.Body>
          <p>{t('general.loading_with_dots')}</p>
        </Card.Body>
      </Card>
    </AccountClassesBase>
  )
  // Error
  if (error) {
    console.log(error)
    return (
      <AccountClassesBase>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.error_sad_smiley')}</p>
          </Card.Body>
        </Card>
      </AccountClassesBase>
    )
  }

  const account = data.account
  const scheduleItemAttendances = data.scheduleItemAttendances
  
  // Empty list
  if (!scheduleItemAttendances.edges.length) {
    return (
      <AccountClassesBase account={account}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('relations.account.classes.empty_list')}</p>
          </Card.Body>
        </Card>
      </AccountClassesBase>
    )
  }

  // Return populated list
  return (
    <AccountClassesBase account={account}>
      <ContentCard 
        cardTitle={cardTitle}
        pageInfo={scheduleItemAttendances.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: scheduleItemAttendances.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.scheduleItemAttendances.edges
              const pageInfo = fetchMoreResult.scheduleItemAttendances.pageInfo

              return newEdges.length
                ? {
                    // Put the new scheduleItemAttendances at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    scheduleItemAttendances: {
                      __typename: previousResult.scheduleItemAttendances.__typename,
                      edges: [ ...previousResult.scheduleItemAttendances.edges, ...newEdges ],
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
              <Table.ColHeader>{t('general.time')}</Table.ColHeader>
              <Table.ColHeader>{t('general.class')}</Table.ColHeader>
              <Table.ColHeader>{t('general.location')}</Table.ColHeader>
              <Table.ColHeader>{t('general.booking_status')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>  
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {scheduleItemAttendances.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                { console.log(node) }
                { console.log(account) }
                <Table.Col>
                  { moment(node.date).format(dateFormat) } <br />
                  <span className="text-muted">
                    {moment(node.date + ' ' + node.scheduleItem.timeStart).format(timeFormat)}
                  </span>
                </Table.Col>
                <Table.Col>
                  { node.scheduleItem.organizationClasstype.name }
                </Table.Col>
                <Table.Col>
                  { node.scheduleItem.organizationLocationRoom.organizationLocation.name } <br />
                  <span className="text-muted">
                    { node.scheduleItem.organizationLocationRoom.name }
                  </span> 
                </Table.Col>
                <Table.Col>
                  <BadgeBookingStatus status={node.bookingStatus} />
                </Table.Col>
                <Table.Col>
                  <AccountClassDelete account={account} node={node} />
                </Table.Col>
                {/* <Table.Col className="text-right" key={v4()}>
                  <Link to={"/relations/accounts/" + match.params.account_id + "/classpasses/edit/" + node.id}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  </Link>
                </Table.Col> */}
                {/* <Mutation mutation={DELETE_ACCOUNT_CLASSPASS} key={v4()}>
                  {(deleteAccountClasspass, { data }) => (
                    <Table.Col className="text-right" key={v4()}>
                      <button className="icon btn btn-link btn-sm" 
                        title={t('general.delete')} 
                        href=""
                        onClick={() => {
                          confirm_delete({
                            t: t,
                            msgConfirm: t("relations.account.classpasses.delete_confirm_msg"),
                            msgDescription: <p>{node.organizationClasspass.name} {node.dateStart}</p>,
                            msgSuccess: t('relations.account.classpasses.deleted'),
                            deleteFunction: deleteAccountClasspass,
                            functionVariables: { variables: {
                              input: {
                                id: node.id
                              }
                            }, refetchQueries: [
                              {query: GET_ACCOUNT_CLASSPASSES_QUERY, variables: { archived: archived, accountId: match.params.account_id }} 
                            ]}
                          })
                      }}>
                        <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
                      </button>
                    </Table.Col>
                  )}
                </Mutation> */}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </AccountClassesBase>
  )
}

        
export default withTranslation()(withRouter(AccountClasses))