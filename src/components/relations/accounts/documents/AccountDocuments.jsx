import React, { useContext } from 'react'
import { useMutation, useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Icon,
  Button,
  Card,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"
import confirm_delete from "../../../../tools/confirm_delete"

import ContentCard from "../../../general/ContentCard"
import RelationsAccountProfileBase from '../RelationsAccountProfileBase'
import ButtonAdd from '../../../ui/ButtonAdd'
import AppSettingsContext from '../../../context/AppSettingsContext'
import { GET_DOCUMENTS_QUERY, DELETE_DOCUMENT } from "./queries"
import FileProtectedDownloadTableButton from "../../../ui/FileProtectedDownloadTableButton"


function AccountDocuments({t, match}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const accountId = match.params.account_id
  const activeLink = "documents"
  const cardTitle = t('relations.account.documents.title')
  const pageHeaderButtonList = <HasPermissionWrapper 
    permission="add"
    resource="accountdocument">
      <ButtonAdd addUrl={`/relations/accounts/${accountId}/documents/add`} className='ml-2' />
  </HasPermissionWrapper>

  const {loading, error, data, fetchMore} = useQuery(GET_DOCUMENTS_QUERY, {
    variables: { account: accountId },
    fetchPolicy: "network-only"
  })
  const [deleteAccountDocument] = useMutation(DELETE_DOCUMENT)

  if (loading) return(
    <RelationsAccountProfileBase activeLink={activeLink} pageHeaderButtonList={pageHeaderButtonList}>
      <Card title={cardTitle}>
        {t('general.loading_with_dots')}
      </Card>
    </RelationsAccountProfileBase>
  )

  if (error) return(
    <RelationsAccountProfileBase activeLink={activeLink} pageHeaderButtonList={pageHeaderButtonList}>
      {console.log(error)}
      <Card title={cardTitle}>
        {t('general.error_sad_smiley')}
      </Card>
    </RelationsAccountProfileBase>
  )

  const account = data.account
  const accountDocuments = data.accountDocuments
  console.log(accountDocuments)

  // Empty list
  if (!accountDocuments.edges.length) {
    return (
      <RelationsAccountProfileBase activeLink={activeLink} user={account} pageHeaderButtonList={pageHeaderButtonList}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('relations.account.documents.empty_list')}</p>
          </Card.Body>
        </Card>
      </RelationsAccountProfileBase>
    )
  }

  return (
    <RelationsAccountProfileBase 
      user={account}
      activeLink={activeLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <ContentCard 
        cardTitle={t('relations.account.documents.title')}
        pageInfo={accountDocuments.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: accountDocuments.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.accountDocuments.edges
              const pageInfo = fetchMoreResult.accountDocuments.pageInfo

              return newEdges.length
                ? {
                    // Put the new accountDocuments at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    accountDocuments: {
                      __typename: previousResult.accountDocuments.__typename,
                      edges: [ ...previousResult.accountDocuments.edges, ...newEdges ],
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
              <Table.ColHeader>{t('general.document')}</Table.ColHeader>
              <Table.ColHeader>{t('general.time')}</Table.ColHeader>
              <Table.ColHeader>{t('general.download')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader> 
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {accountDocuments.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.description}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {moment(node.createdAt).format(dateFormat)}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    <FileProtectedDownloadTableButton protectedMediaUrl={node.urlProtectedDocument} />
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <Link to={"/relations/accounts/" + accountId + "/documents/edit/" + node.id}>
                      <Button className='btn-sm' 
                              color="secondary">
                        {t('general.edit')}
                      </Button>
                    </Link>
                    <button className="icon btn btn-link btn-sm" 
                      title={t('general.delete')} 
                      href=""
                      onClick={() => {
                        confirm_delete({
                          t: t,
                          msgConfirm: t("relations.account.documents.delete_confirm_msg"),
                          msgDescription: <p>{node.description}</p>,
                          msgSuccess: t('relations.account.documents.deleted'),
                          deleteFunction: deleteAccountDocument,
                          functionVariables: { variables: {
                            input: {
                              id: node.id
                            }
                          }, refetchQueries: [
                            {query: GET_DOCUMENTS_QUERY, variables: { account: accountId }} 
                          ]}
                        })
                    }}>
                      <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
                    </button>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>    
    </RelationsAccountProfileBase>
  )
}

        
export default withTranslation()(withRouter(AccountDocuments))