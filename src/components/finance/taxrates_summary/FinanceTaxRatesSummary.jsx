// @flow

import React from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Icon,
  Dimmer,
  Button,
  Table, 
  Text
} from "tabler-react";

// import { get_list_query_variables } from "./tools"
import ContentCard from "../../general/ContentCard"
import FinanceTaxRatesSummaryBase from "./FinanceTaxRatesSummaryBase"

import { GET_INSIGHT_FINANCE_TAX_SUMMARY_QUERY } from "./queries"


import { dateToLocalISO } from '../../../tools/date_tools'
import CSLS from "../../../tools/cs_local_storage"
import confirm_delete from "../../../tools/confirm_delete"
import moment from 'moment'


function FinanceTaxRatesSummary({ t, location, history }) {
  const cardTitle = t('finance.taxrates_summary.title')
  const dateStart = moment().startOf('month')
  const dateEnd   = moment().endOf('month')

  // Set back location for edit invoice
  // localStorage.setItem(CSLS.FINANCE_INVOICES_EDIT_RETURN, location.pathname)
  // Fetch data
  const { loading, error, data, refetch } = useQuery(GET_INSIGHT_FINANCE_TAX_SUMMARY_QUERY, {
    variables: {
      dateStart: dateToLocalISO(dateStart),
      dateEnd: dateToLocalISO(dateEnd)
    },
    fetchPolicy: "network-only"
  })

  if (loading) return (
    <FinanceTaxRatesSummaryBase refetch={refetch}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceTaxRatesSummaryBase>
  )
  // Error
  if (error) return (
    <FinanceTaxRatesSummaryBase refetch={refetch}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('finance.taxrates_summary.error_loading')}</p>
      </ContentCard>
    </FinanceTaxRatesSummaryBase>
  )

  const taxRatesSummary = data.insightFinanceTaxRateSummary

  // Empty list
  if (!taxRatesSummary.data.length) { return (
    <FinanceTaxRatesSummaryBase refetch={refetch}>
      <ContentCard cardTitle={cardTitle}>
        <p>
          {t('finance.taxrates_summary.empty_list')}
        </p>
      </ContentCard>
    </FinanceTaxRatesSummaryBase>
  )}

  return (
    <FinanceTaxRatesSummaryBase refetch={refetch}>
      <ContentCard cardTitle={t('finance.taxrates_summary.title')}
                  pageInfo={taxRatesSummary.pageInfo}
                  // onLoadMore={() => {
                  //   fetchMore({
                  //     variables: {
                  //       after: taxRatesSummary.pageInfo.endCursor
                  //     },
                  //     updateQuery: (previousResult, { fetchMoreResult }) => {
                  //       const newEdges = fetchMoreResult.financeInvoices.edges
                  //       const pageInfo = fetchMoreResult.financeInvoices.pageInfo

                  //       return newEdges.length
                  //         ? {
                  //             // Put the new taxRatesSummary at the end of the list and update `pageInfo`
                  //             // so we have the new `endCursor` and `hasNextPage` values
                  //             financeInvoices: {
                  //               __typename: previousResult.taxRatesSummary.__typename,
                  //               edges: [ ...previousResult.taxRatesSummary.edges, ...newEdges ],
                  //               pageInfo
                  //             }
                  //           }
                  //         : previousResult
                  //     }
                  //   })
                  // }} 
        >
        <Table>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.tax_rate')}</Table.ColHeader> // Tax rate name
              <Table.ColHeader>{t('general.percentage')}</Table.ColHeader> // Percentage
              <Table.ColHeader>{t('general.total')}</Table.ColHeader> // Percentage

            </Table.Row>
          </Table.Header>
          <Table.Body>
              {/* {invoices.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    <FinanceInvoicesStatus status={node.status} />
                  </Table.Col>
                  <Table.Col key={v4()}>
                    <Link to={"/finance/invoices/edit/" + node.id}>
                      {node.invoiceNumber}
                    </Link>
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {(node.account) ? 
                      <Link to={"/relations/accounts/" + node.account.id + "/profile"}>
                        {(node.relationCompany) ? node.relationCompany: node.relationContactName}
                      </Link> :
                      (node.relationCompany) ? node.relationCompany: node.relationContactName
                    }
                    <br />
                    <Text.Small color="gray">{node.summary.trunc(20)}</Text.Small>
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {moment(node.dateSent).format('LL')} <br />
                    {moment(node.dateDue).format('LL')}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.totalDisplay}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.balanceDisplay}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <Link to={"/finance/invoices/edit/" + node.id}>
                      <Button className='btn-sm' 
                              color="secondary">
                        {t('general.edit')}
                      </Button>
                    </Link>
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <button className="icon btn btn-link btn-sm" 
                      title={t('general.delete')} 
                      href=""
                      onClick={() => {
                        confirm_delete({
                          t: t,
                          msgConfirm: t("finance.invoices.delete_confirm_msg"),
                          msgDescription: <p>{node.invoiceNumber}</p>,
                          msgSuccess: t('finance.invoices.deleted'),
                          deleteFunction: deleteFinanceInvoice,
                          functionVariables: { 
                            variables: {
                              input: {
                                id: node.id
                              }
                            }, 
                            refetchQueries: [
                              {query: GET_INVOICES_QUERY, variables: get_list_query_variables() } 
                            ]
                          }
                        })
                    }}>
                      <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
                    </button>
                </Table.Col>
                </Table.Row>
              ))} */}
          </Table.Body>
        </Table>
      </ContentCard>
    </FinanceTaxRatesSummaryBase>
  )
} 

export default withTranslation()(withRouter(FinanceTaxRatesSummary))