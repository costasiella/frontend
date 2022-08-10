import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'
import { toast } from 'react-toastify'
import {
  Alert,
  Dropdown,
  Page,
  Grid,
  Icon,
  Button,
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"

import { GET_INVOICE_QUERY, CANCEL_AND_CREATE_CREDIT_INVOICE } from '../queries'
import { TOKEN_REFRESH } from "../../../../queries/system/auth"
import { refreshTokenAndOpenExportLinkInNewTab } from "../../../../tools/refresh_token_and_open_export_link"

import CSLS from "../../../../tools/cs_local_storage"

import FinanceInvoiceEditBase from "./FinanceInvoiceEditBase"
import FinanceInvoiceEditItems from "./FinanceInvoiceEditItems"
import FinanceInvoiceEditAdditional from "./FinanceInvoiceEditAdditional"
import FinanceInvoiceEditBalance from "./FinanceInvoiceEditBalance"
import FinanceInvoiceEditOptions from "./FinanceInvoiceEditOptions"
import FinanceInvoiceEditOrganization from "./FinanceInvoiceEditOrganization"
import FinanceInvoiceEditSummary from "./FinanceInvoiceEditSummary"
import FinanceInvoiceEditTo from "./FinanceInvoiceEditTo"
import FinanceInvoiceEditPayments from "./FinanceInvoiceEditPayments"

function FinanceInvoiceEdit({t, match, history}) {
  const id = match.params.id
  const { loading, error, data, refetch } = useQuery(GET_INVOICE_QUERY, {
    variables: {
      id: id
    },
  })

  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)
  const [cancelAndCreateCreditInvoice] = useMutation(CANCEL_AND_CREATE_CREDIT_INVOICE)
  
  // Loading
  if (loading) return <FinanceInvoiceEditBase>{t('general.loading_with_dots')}</FinanceInvoiceEditBase>
  // Error
  if (error) {
    console.log(error)
    return <FinanceInvoiceEditBase>{t('general.error_sad_smiley')}</FinanceInvoiceEditBase>
  }

  // Fetch back location from localStorage, if no value set, default back to /finance/invoices
  let returnUrl = localStorage.getItem(CSLS.FINANCE_INVOICES_EDIT_RETURN)
  if (!returnUrl) {
    returnUrl = "/finance/invoices"
  }
  const export_url = "/d/export/invoice/pdf/" + id
  const payment_add_url = `/finance/invoices/${id}/payment/add`
  const shopAccountInvoiceUrl = `${window.location.protocol}//${window.location.host}/#/shop/account/invoice/${id}`

  return (
    <FinanceInvoiceEditBase>
      <Page.Header title={t('finance.invoice.title') + ' #' + data.financeInvoice.invoiceNumber}>
        <div className="page-options d-flex">
          {/* Back */}
          <Link to={returnUrl} 
                className='btn btn-secondary mr-2'>
              <Icon prefix="fe" name="arrow-left" /> {t('general.back')} 
          </Link>
          {/* Add payment */}
          <Link to={payment_add_url} 
              className='btn btn-secondary mr-2'>
              <Icon prefix="fe" name="dollar-sign" /> {t('finance.invoice.payments.add')} 
          </Link>
          {/* Export as PDF */}
          <Button
            color="secondary"
            icon="printer"
            className="mr-2"
            onClick={() => refreshTokenAndOpenExportLinkInNewTab(
              t, doTokenRefresh, history, export_url
            )}
          >
            {t('general.pdf')} 
          </Button>
          {/* Tools */}
          <Dropdown
            className=""
            type="button"
            toggle
            icon="tool"
            color="secondary"
            triggerContent={t("general.tools")}
            items={[
              <HasPermissionWrapper permission="change" resource="financeinvoice">
                <Dropdown.Item
                  key={v4()}
                  icon="slash"
                  onClick={() => {
                    cancelAndCreateCreditInvoice({ variables: {
                      input: {
                        id: id,
                      }
                    }, refetchQueries: []
                    })
                    .then(({ data }) => {
                        console.log('got data', data)
                        const creditInvoiceId = data.cancelAndCreateCreditFinanceInvoice.financeInvoice.id
                        history.push(`/finance/invoices/edit/${creditInvoiceId}`)
                        toast.success((t('finance.invoice.now_editing_credit_invoice')), {
                            position: toast.POSITION.BOTTOM_RIGHT
                          })
                      }).catch((error) => {
                        toast.error((t('general.toast_server_error')) +  error, {
                            position: toast.POSITION.BOTTOM_RIGHT
                          })
                        console.log('there was an error sending the query', error)
                      })
                  }}>
                    {t('finance.invoice.cancel_and_create_credit_invoice')}
                </Dropdown.Item>
              </HasPermissionWrapper>
            ]}>
          </Dropdown>
        </div>
      </Page.Header>
      <Grid.Row>
        <Grid.Col md={9}>
          <FinanceInvoiceEditSummary 
            initialData={data}
          />
        <Alert type="primary">
          <div className="mb-1"><b>{t("finance.invoice.account_profile_link")}</b></div>
          {shopAccountInvoiceUrl}<br />
          <div className="mt-1"><small><Icon name="info" /> {t("finance.invoice.account_profile_link_explanation")}</small></div>
        </Alert>
          <Grid.Row>
            <Grid.Col md={6} ml={0}>
              <FinanceInvoiceEditOrganization organization={data.organization} />
            </Grid.Col>
            <Grid.Col md={6} ml={0}>
              <FinanceInvoiceEditTo financeInvoice={data.financeInvoice} />
            </Grid.Col>
          </Grid.Row>
        </Grid.Col>
        <Grid.Col md={3}>
          <FinanceInvoiceEditBalance financeInvoice={data.financeInvoice} />
          <FinanceInvoiceEditOptions initialData={data} />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col md={12}>
          <FinanceInvoiceEditItems inputData={data} refetchInvoice={refetch} />
          <FinanceInvoiceEditAdditional initialData={data} />
          <FinanceInvoiceEditPayments inputData={data} />
        </Grid.Col>
      </Grid.Row>
    </FinanceInvoiceEditBase>
  )
}


export default withTranslation()(withRouter(FinanceInvoiceEdit))