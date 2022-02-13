import React from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Button,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../HasPermissionWrapper"

import ButtonAdd from '../../ui/ButtonAdd'
import ButtonBack from '../../ui/ButtonBack'
import ISODateString from "../../ui/ISODateString"
import FileDownloadTableButton from "../../ui/FileDownloadTableButton"
import ContentCard from "../../general/ContentCard"

import OrganizationDocumentsBase from "./OrganizationDocumentsBase"
import OrganizationDocumentsDelete from "./OrganizationDocumentDelete"
import { getSubtitle } from './tools'

import { GET_DOCUMENTS_QUERY, DELETE_DOCUMENT } from "./queries"


function OrganizationListDocuments({ t, match, history }) {
  const organizationId = match.params.organization_id
  const documentType = match.params.document_type
  const subTitle = getSubtitle(t, documentType)
  const cardTitle = t('organization.documents.title') + ' - ' + subTitle

  const pageHeaderButtonList = <React.Fragment>
      <ButtonBack returnUrl={`/organization/documents/${organizationId}`} />
      <HasPermissionWrapper 
        permission="add"
        resource="organizationdocument"
      >
        <ButtonAdd addUrl={`/organization/documents/${organizationId}/${documentType}/add`} className="ml-2" />
      </HasPermissionWrapper>
    </React.Fragment>

  const { loading, error, data, fetchMore } = useQuery(GET_DOCUMENTS_QUERY, {
    variables: { documentType: documentType }
  })

  if (loading) {
    return (
      <OrganizationDocumentsBase pageHeaderButtonList={pageHeaderButtonList}>
        {t('general.loading_with_dots')}
      </OrganizationDocumentsBase>
    )
  }

  if (error) {
    return (
      <OrganizationDocumentsBase  pageHeaderButtonList={pageHeaderButtonList}>
        {t('organization.documents.error_loading')}
      </OrganizationDocumentsBase>
    )
  }

  // Empty list
  if (!data.organizationDocuments.edges.length) { return (
    <OrganizationDocumentsBase pageHeaderButtonList={pageHeaderButtonList}>
      <ContentCard cardTitle={cardTitle}>
        <p>
         {t('organization.documents.empty_list')}
        </p>
      </ContentCard>
    </OrganizationDocumentsBase>
  )}   
  

  return (
    <OrganizationDocumentsBase pageHeaderButtonList={pageHeaderButtonList}>
      <ContentCard 
        cardTitle={cardTitle}
        pageInfo={data.organizationDocuments.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: data.organizationDocuments.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.organizationDocuments.edges
              const pageInfo = fetchMoreResult.organizationDocuments.pageInfo

              return newEdges.length
                ? {
                    // Put the fetched documents at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    organizationDocuments: {
                      __typename: previousResult.organizationDocuments.__typename,
                      edges: [ ...previousResult.organizationDocuments.edges, ...newEdges ],
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
              <Table.ColHeader>{t('general.date')}</Table.ColHeader>
              <Table.ColHeader>{t('general.version')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {data.organizationDocuments.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    <ISODateString ISODateStr={node.dateStart} />
                    {(node.dateEnd) ? <span> - <ISODateString ISODateStr={node.dateEnd} /></span> : ""}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.version}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <FileDownloadTableButton mediaUrl={node.urlDocument} />
                    <Link to={`/organization/documents/${organizationId}/${documentType}/edit/${node.id}`} >
                      <Button className='btn-sm' 
                              color="secondary">
                        {t('general.edit')}
                      </Button>
                    </Link>
                    <OrganizationDocumentsDelete node={node} />
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </OrganizationDocumentsBase>
  )

}

export default withTranslation()(withRouter(OrganizationListDocuments))