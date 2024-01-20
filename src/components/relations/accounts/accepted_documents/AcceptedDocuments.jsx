import React, { useContext } from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'

import {
  Card,
  Page,
  Grid,
  Container,
  Table
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'
import SiteWrapper from "../../../SiteWrapper"
import RelationsAccountsBack from "../RelationsAccountsBack"
import DocumentType from "../../../ui/DocumentType"
import FileDownloadTableButton from "../../../ui/FileDownloadTableButton"
import ContentCard from "../../../general/ContentCard"
import ProfileMenu from "../ProfileMenu"
import ProfileCardSmall from "../../../ui/ProfileCardSmall"

import { GET_ACCOUNT_ACCEPTED_DOCUMENTS_QUERY } from "./queries"




function AccountAcceptedDocuments({ t, history, match }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const cardTitle = t('relations.account.accepted_documents.title')

  const accountId = match.params.account_id
  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_ACCEPTED_DOCUMENTS_QUERY, {
    variables: {
      account: accountId
    },
    fetchPolicy: "network-only"
  })

  // Loading
  if (loading) return <p>{t('general.loading_with_dots')}</p>
  // Error
  if (error) {
    console.log(error)
    return <p>{t('general.error_sad_smiley')}</p>
  }

  console.log(data)
  
  const account = data.account
  const acceptedDocuments = data.accountAcceptedDocuments

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={account.firstName + " " + account.lastName} >
            <div className='page-options d-flex'>
              <RelationsAccountsBack />
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {
              // Empty list
                (!acceptedDocuments.edges.length) ?
                  <Card title={cardTitle}>
                    <Card.Body>
                      <p>{t('relations.account.accepted_documents.empty_list')}</p>
                    </Card.Body>
                  </Card>
                :
                <ContentCard 
                  cardTitle={cardTitle}
                  pageInfo={acceptedDocuments.pageInfo}
                  hasCardBody={false}
                  onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: data.accountAcceptedDocuments.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.accountAcceptedDocuments.edges
                        const pageInfo = fetchMoreResult.accountAcceptedDocuments.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new acceptedDocuments at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              accountAcceptedDocuments: {
                                __typename: previousResult.accountAcceptedDocuments.__typename,
                                edges: [ ...previousResult.accountAcceptedDocuments.edges, ...newEdges ],
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
                        <Table.ColHeader>{t('general.document_type')}</Table.ColHeader>
                        <Table.ColHeader>{t('general.date_accepted')}</Table.ColHeader>
                        <Table.ColHeader>{t('relations.account.accepted_documents.accepted_from_address')}</Table.ColHeader>
                        <Table.ColHeader><span className="pull-right">{t('general.document')}</span></Table.ColHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {acceptedDocuments.edges.map(({ node }) => (
                          <Table.Row key={v4()}>
                            <Table.Col key={v4()}>
                              <DocumentType documentType={node.document.documentType} />
                            </Table.Col>
                            <Table.Col key={v4()}>
                              {moment(node.dateAccepted).format(dateFormat)}
                            </Table.Col>
                            <Table.Col>
                              {node.clientIp}
                            </Table.Col>
                            <Table.Col key={v4()}>
                              <FileDownloadTableButton mediaUrl={node.document.urlDocument} className="pull-right" />
                            </Table.Col>
                          </Table.Row>
                        ))}
                    </Table.Body>
                  </Table>
                </ContentCard>
              }
            </Grid.Col>
            <Grid.Col md={3}>
              <ProfileCardSmall user={account}/>
              <ProfileMenu 
                activeLink='accepted_documents' 
                accountId={match.params.account_id}
              />
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

      
        
export default withTranslation()(withRouter(AccountAcceptedDocuments))