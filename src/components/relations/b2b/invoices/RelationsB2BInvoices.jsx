import React from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Card,
} from "tabler-react"

import CSLS from '../../../../tools/cs_local_storage'
import ContentCard from '../../../general/ContentCard';
import FinanceInvoicesList from '../../../finance/invoices/FinanceInvoicesList'

import { GET_INVOICES_QUERY } from './queries'
import RelationsB2BEditBase from '../RelationsB2BEditBase'

function RelationsB2BInvoices({ t, match, location, history}) {
  const businessId = match.params.business_id
  const activeLink = 'invoices'
  const cardTitle = t('finance.invoices.title')
  const { loading, error, data, fetchMore } = useQuery(GET_INVOICES_QUERY, {
    variables: {
      business: businessId
    }
  })

  localStorage.setItem(CSLS.FINANCE_INVOICES_EDIT_RETURN, location.pathname)
  localStorage.setItem(CSLS.RELATIONS_ACCOUNT_PROFILE_RETURN, location.pathname)

  // Loading
  if (loading) return <RelationsB2BEditBase activeLink={activeLink}>
      <Card title={cardTitle}>
        <Card.Body>{t('general.loading_with_dots')}</Card.Body>
      </Card>
    </RelationsB2BEditBase>
  // Error
  if (error) {
    console.log(error)
    return <RelationsB2BEditBase activeLink={activeLink}>
      <Card title={cardTitle}>
        <Card.Body>{t('general.error_sad_smiley')}</Card.Body>
      </Card>
    </RelationsB2BEditBase>
  }

  const business = data.business
  const invoices = data.financeInvoices
  
  // Empty list
  if (!invoices.edges.length) {
    return (
      <RelationsB2BEditBase activeLink={activeLink} pageTitle={business.name}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('relations.b2b.invoices.empty_list')}</p>
          </Card.Body>
        </Card>
      </RelationsB2BEditBase>
    )
  }


  

  return (
    <RelationsB2BEditBase activeLink={activeLink} pageTitle={business.name}>
      <ContentCard 
        cardTitle={cardTitle}
        hasCardBody={false}
        pageInfo={invoices.pageInfo}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: invoices.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.financeInvoices.edges
              const pageInfo = fetchMoreResult.financeInvoices.pageInfo

              return newEdges.length
                ? {
                    // Put the new invoices at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    financeInvoices: {
                      __typename: previousResult.financeInvoices.__typename,
                      edges: [ ...previousResult.financeInvoices.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                : previousResult
            }
          })
        }} 
      >
        <FinanceInvoicesList 
          invoices={invoices} 
          showColRelation={true}
        />
      </ContentCard>
    </RelationsB2BEditBase>
  )
}


export default withTranslation()(withRouter(RelationsB2BInvoices))