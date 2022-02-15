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
import ButtonBack from '../../../ui/ButtonBack'
import ContentCard from "../../../general/ContentCard"
import RelationsAccountProfileBase from '../RelationsAccountProfileBase'

import { GET_ACCOUNT_CLASSPASS_CLASSES_QUERY } from "./queries"


function AccountClasspassClasses({t, match}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const dateTimeFormatMoment = appSettings.dateTimeFormatMoment

  const id = match.params.id
  const accountId = match.params.account_id
  const activeLink = "classpasses"
  const cardTitle = t('relations.account.classpasses.title_classes')
  const back = <div className="page-options d-flex">
    <ButtonBack returnUrl={`/relations/accounts/${accountId}/classpasses`} />
  </div>

  const {loading, error, data, fetchMore} = useQuery(GET_ACCOUNT_CLASSPASS_CLASSES_QUERY, {
    variables: { 
      accountId: accountId,
      id: id
    }
  })

  if (loading) return(
    <RelationsAccountProfileBase activeLink={activeLink} back={back}>
      <Card title={cardTitle}>
        {t('general.loading_with_dots')}
      </Card>
    </RelationsAccountProfileBase>
  )

  if (error) return(
    <RelationsAccountProfileBase activeLink={activeLink} back={back}>
      {console.log(error)}
      <Card title={cardTitle}>
        {t('general.error_sad_smiley')}
      </Card>
    </RelationsAccountProfileBase>
  )

  const account = data.account
  const accountClasspass = data.accountClasspass
  const classes = accountClasspass.classes
  console.log(classes)

  const cardTitleWithCardInfo = `${cardTitle} ${accountClasspass.organizationClasspass.name} (${moment(accountClasspass.dateStart).format(dateFormat)})`

  if (!classes.edges.length) return (
    <RelationsAccountProfileBase user={account} activeLink={activeLink} back={back}>
      {console.log(error)}
      <Card title={cardTitleWithCardInfo}>
        <Card.Body>
          {t("relations.account.classpasses.no_classes_taken_yet")}
        </Card.Body>
      </Card>
    </RelationsAccountProfileBase>
  )



  return (
    <RelationsAccountProfileBase user={account} activeLink={activeLink} back={back}>
      <ContentCard 
        cardTitle={cardTitleWithCardInfo}
        pageInfo={classes.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: classes.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.classes.edges
              const pageInfo = fetchMoreResult.classes.pageInfo

              return newEdges.length
                ? {
                    // Put the new accountClasspasses at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    classes: {
                      __typename: previousResult.classes.__typename,
                      edges: [ ...previousResult.classes.edges, ...newEdges ],
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
              <Table.ColHeader>{t('general.location')}</Table.ColHeader>
              <Table.ColHeader>{t('general.class')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {classes.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {moment(new Date(node.date + " " + node.scheduleItem.timeStart)).format(dateTimeFormatMoment)}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.scheduleItem.organizationLocationRoom.organizationLocation.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.scheduleItem.organizationClasstype.name}
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>    
    </RelationsAccountProfileBase>
  )
}

        
export default withTranslation()(withRouter(AccountClasspassClasses))