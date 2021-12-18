import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import { v4 } from "uuid"
import C3Chart from "react-c3js"
import moment from 'moment'
import {
  Icon,
  List,
  Table
} from "tabler-react";

import { GET_TRIALPASSES_QUERY } from './queries'
import { TOKEN_REFRESH } from "../../../queries/system/auth"

import ContentCard from '../../general/ContentCard'
import AppSettingsContext from '../../context/AppSettingsContext'
import CSLS from "../../../tools/cs_local_storage"
import { refreshTokenAndOpenExportLinkInNewTab } from "../../../tools/refresh_token_and_open_export_link"

import InsightTrialpassesBase from './InsightTrialpassesBase'
import { getListQueryVariables } from './tools'

// Set some initial values for dates, if not found
if (!localStorage.getItem(CSLS.INSIGHT_TRIALPASSES_YEAR)) {
  console.log('year from not found... defaulting to today...')
  localStorage.setItem(CSLS.INSIGHT_TRIALPASSES_YEAR, moment().format('YYYY')) 
  localStorage.setItem(CSLS.INSIGHT_TRIALPASSES_MONTH, moment().format('MM')) 
} 

function InsightTrialpasses ({ t, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  const year = localStorage.getItem(CSLS.INSIGHT_TRIALPASSES_YEAR)
  const month = localStorage.getItem(CSLS.INSIGHT_TRIALPASSES_MONTH)
  const cardTitle = t("insight.trialpasses.title")

  const listVariables = getListQueryVariables()

  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_TRIALPASSES_QUERY, {
    variables: listVariables
  })

  if (loading) {
    return (
      <InsightTrialpassesBase year={year}>
        {t("general.loading_with_dots")}
      </InsightTrialpassesBase>
    )
  }

  if (error) {
    return (
      <InsightTrialpassesBase year={year}>
        {t("general.error_sad_smiley")}
      </InsightTrialpassesBase>
    )
  }

  console.log(data)
  let accountClasspasses = data.accountClasspasses


  return (
    <InsightTrialpassesBase year={year} month={month} refetch={refetch}>
      <ContentCard cardTitle={cardTitle}
          // headerContent={headerOptions}
          hasCardBody={false}
          pageInfo={accountClasspasses.pageInfo}
          onLoadMore={() => {
          fetchMore({
            variables: {
              after: accountClasspasses.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.accountClasspasses.edges
              const pageInfo = fetchMoreResult.accountClasspasses.pageInfo

              return newEdges.length
                ? {
                    // Put the new glaccounts at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    accountClasspasses: {
                      __typename: previousResult.accountClasspasses.__typename,
                      edges: [ ...previousResult.accountClasspasses.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                : previousResult
            }
          })
        }} >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.classpass')}</Table.ColHeader>
              <Table.ColHeader>{t('general.account')}</Table.ColHeader>
              <Table.ColHeader>{t('general.products')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {accountClasspasses.edges.map(({ node }) => (
                <Table.Row>
                  <Table.Col>
                    {node.organizationClasspass.name} <br />
                    <small className='text-muted'>
                      {node.dateStart}
                    </small>
                  </Table.Col>
                  <Table.Col>
                    <Link to={`/relations/accounts/${node.account.id}/profile/`}>
                      {node.account.fullName}
                    </Link>
                  </Table.Col>
                  <Table.Col>
                    <List unstyled>
                      {node.account.classpasses.edges && node.account.classpasses.edges.map(({ node }) => (
                        <List.Item>
                          <Icon name="credit-card" /> { " " }
                          {node.organizationClasspass.name} <br />
                          <small className='text-muted'>
                            {node.dateStart}
                          </small>
                        </List.Item>
                      ))}
                    </List>
                    <List unstyled>
                      {node.account.subscriptions.edges && node.account.subscriptions.edges.map(({ node }) => (
                        <List.Item>
                          <Icon name="edit" /> { " " }
                          {node.organizationSubscription.name} <br />
                          <small className='text-muted'>
                            {node.dateStart}
                          </small>
                        </List.Item>
                      ))}
                    </List>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </InsightTrialpassesBase>
  )
}

export default withTranslation()(withRouter(InsightTrialpasses))