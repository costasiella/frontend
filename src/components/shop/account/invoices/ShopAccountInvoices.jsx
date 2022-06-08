import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import AppSettingsContext from '../../../context/AppSettingsContext'
import FinanceInvoicesStatus from "../../../ui/FinanceInvoiceStatus"
import { TOKEN_REFRESH } from "../../../../queries/system/auth"
import { refreshTokenAndOpenExportLinkInNewTab } from "../../../../tools/refresh_token_and_open_export_link"

import {
  Button,
  Card,
  Dimmer,
  Grid,
  Icon,
  Table,
} from "tabler-react"
import { QUERY_ACCOUNT_INVOICES } from "./queries"
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"
import LoadMoreOnBottomScroll from "../../../general/LoadMoreOnBottomScroll"

import ShopAccountInvoicesBase from "./ShopAccountInvoicesBase"


function ShopAccountInvoices({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const onlinePaymentsAvailable = appSettings.onlinePaymentsAvailable

  // Chain queries. First query user data and then query invoices for that user once we have the account Id.
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
  const { loading, error, data, fetchMore } = useQuery(QUERY_ACCOUNT_INVOICES, {
    skip: loadingUser || errorUser || !dataUser,
    variables: {
      account: dataUser && dataUser.user ? dataUser.user.accountId : null
    },
    fetchPolicy: "network-only"
  })
  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)

  if (loading || loadingUser || !data) return (
    <ShopAccountInvoicesBase>
      <Dimmer active={true} loader={true} />
    </ShopAccountInvoicesBase>
  )
  if (error || errorUser) return (
    <ShopAccountInvoicesBase>
      {t("shop.account.classpasses.error_loading_data")}
    </ShopAccountInvoicesBase>
  )

  console.log("User data: ###")
  console.log(data)
  const user = dataUser.user
  const invoices = data.financeInvoices

  // Empty list
  if (!invoices.edges.length) {
    return (
      <ShopAccountInvoicesBase accountName={user.fullName}>
        <Grid.Row>
          <Grid.Col md={12}>
            <Card cardTitle={t('shop.account.invoices.title')} >
              <Card.Body>
                {t('shop.account.invoices.empty_list')}
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </ShopAccountInvoicesBase>
    )  
  }

  // Populated list
  return (
    <ShopAccountInvoicesBase accountName={user.fullName}>
      <Grid.Row>
        <Grid.Col md={12}>
          <LoadMoreOnBottomScroll
            // headerContent={headerOptions}
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
                        // Put the new subscriptions at the end of the list and update `pageInfo`
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
            <h4>{t("shop.account.invoices.title")}</h4>
            <Grid.Row>
              {invoices.edges.map(({ node }) => (
                <Grid.Col xs={12} sm={12} md={4} lg={4}>
                  <Card>
                    <Card.Header>
                      <Card.Title>{node.invoiceNumber}</Card.Title>
                      <Card.Options>
                        <FinanceInvoicesStatus status={node.status}/>
                      </Card.Options>
                    </Card.Header>
                    <Card.Body>
                      <span className="text-bold">
                        {node.summary}
                      </span>
                    </Card.Body>
                      <Table cards>
                        <Table.Body>
                          <Table.Row>
                            <Table.ColHeader>{t("general.date")}</Table.ColHeader>
                            <Table.Col>{moment(node.dateSent).format(dateFormat)}</Table.Col>
                          </Table.Row>
                          <Table.Row>
                            <Table.ColHeader>{t("finance.invoices.due")}</Table.ColHeader>
                            <Table.Col>{moment(node.dateDue).format(dateFormat)}</Table.Col>
                          </Table.Row>
                          <Table.Row>
                            <Table.ColHeader>{t("general.total")}</Table.ColHeader>
                            <Table.Col>{node.totalDisplay}</Table.Col>
                          </Table.Row>
                          <Table.Row>
                            <Table.ColHeader>{t("general.balance")}</Table.ColHeader>
                            <Table.Col>{node.balanceDisplay}</Table.Col>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    <Card.Footer>
                      {(node.status === "SENT" && onlinePaymentsAvailable) ?
                        <Link to={"/shop/account/invoice_payment/" + node.id}>
                          <Button
                            className="float-right"
                            color="success"
                          >
                            {t('shop.account.invoices.to_payment')} <Icon name="chevron-right" />
                          </Button>
                        </Link>
                        : ""
                      }  
                      <Button 
                        color="secondary"
                        icon="printer"
                        onClick={() => refreshTokenAndOpenExportLinkInNewTab(
                          t, doTokenRefresh, history, `/d/export/invoice/pdf/${node.id}`
                        )}
                      >
                        {t('general.pdf')}
                      </Button>              
                    </Card.Footer>
                  </Card>
                </Grid.Col>
              ))}
            </Grid.Row>
          </LoadMoreOnBottomScroll>
        </Grid.Col>
      </Grid.Row>
    </ShopAccountInvoicesBase>
  )
}


export default withTranslation()(withRouter(ShopAccountInvoices))