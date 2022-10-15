import React, { useContext } from 'react'
import { useMutation, useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Avatar,
  Icon,
  Card,
  Dimmer,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"
import confirm_delete from "../../../../tools/confirm_delete"

import CSLS from '../../../../tools/cs_local_storage'
import AppSettingsContext from '../../../context/AppSettingsContext'
import ButtonAdd from "../../../ui/ButtonAdd"
import ContentCard from "../../../general/ContentCard"
import RelationsAccountProfileBase from '../RelationsAccountProfileBase'

import { GET_ACCOUNT_PRODUCTS_QUERY, DELETE_ACCOUNT_PRODUCT } from "./queries"


function AccountProducts({t, match, location}) {
  const appSettings = useContext(AppSettingsContext)
  const dateTimeFormatMoment = appSettings.dateTimeFormatMoment

  const accountId = match.params.account_id
  const activeLink = "products"
  const cardTitle = t('relations.account.products.title')
  const pageHeaderButtonList = <HasPermissionWrapper 
    permission="add"
    resource="accountproduct">
      <ButtonAdd addUrl={`/relations/accounts/${accountId}/products/add`} className="ml-2" />
  </HasPermissionWrapper>

  localStorage.setItem(CSLS.FINANCE_INVOICES_EDIT_RETURN, location.pathname)

  const {loading, error, data, fetchMore} = useQuery(GET_ACCOUNT_PRODUCTS_QUERY, {
    variables: { accountId: accountId }
  })
  const [deleteAccountProduct] = useMutation(DELETE_ACCOUNT_PRODUCT)

  if (loading) return(
    <RelationsAccountProfileBase activeLink={activeLink} pageHeaderButtonList={pageHeaderButtonList}>
      <Card title={cardTitle}>
        <Dimmer loader={true} active={true} />
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
  const accountProducts = data.accountProducts

    // Empty list
    if (!accountProducts.edges.length) {
      return (
        <RelationsAccountProfileBase 
          user={account}
          activeLink={activeLink}
          pageHeaderButtonList={pageHeaderButtonList}
        >
          <Card title={cardTitle}>
            <Card.Body>
              <p>{t('relations.account.products.empty_list')}</p>
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
        cardTitle={t('relations.account.products.title')}
        pageInfo={accountProducts.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: accountProducts.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.accountProducts.edges
              const pageInfo = fetchMoreResult.accountProducts.pageInfo

              return newEdges.length
                ? {
                    // Put the new accountClasspasses at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    accountClasspasses: {
                      __typename: previousResult.accountProducts.__typename,
                      edges: [ ...previousResult.accountProducts.edges, ...newEdges ],
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
              <Table.ColHeader />
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('general.quantity')}</Table.ColHeader>
              <Table.ColHeader>{t('general.date_purchased')}</Table.ColHeader>
              <Table.ColHeader>{t('general.invoice')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader> 
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {accountProducts.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    <Avatar size="lg" imageURL={node.organizationProduct.urlImageThumbnailSmall} />
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.organizationProduct.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.quantity}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {moment(node.createdAt).format(dateTimeFormatMoment)}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.invoiceItems.edges.length && 
                      <Link to={`/finance/invoices/edit/${node.invoiceItems.edges[0].node.financeInvoice.id}`}>
                        {node.invoiceItems.edges[0].node.financeInvoice.invoiceNumber}
                      </Link>
                    }
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <button className="icon btn btn-link btn-sm" 
                      title={t('general.delete')} 
                      href=""
                      onClick={() => {
                        confirm_delete({
                          t: t,
                          msgConfirm: t("relations.account.products.delete_confirm_msg"),
                          msgDescription: <p>{node.organizationProduct.name} {moment(node.createdAt).format(dateTimeFormatMoment)}</p>,
                          msgSuccess: t('relations.account.products.deleted'),
                          deleteFunction: deleteAccountProduct,
                          functionVariables: { variables: {
                            input: {
                              id: node.id
                            }
                          }, refetchQueries: [
                            {query: GET_ACCOUNT_PRODUCTS_QUERY, variables: { accountId: accountId }} 
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

        
export default withTranslation()(withRouter(AccountProducts))
