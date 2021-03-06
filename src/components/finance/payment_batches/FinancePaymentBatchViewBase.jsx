import React, {useState} from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation } from "@apollo/client"
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import { toast } from 'react-toastify'

import {
  Page,
  Grid,
  Icon,
  Button,
  Container,
} from "tabler-react";

import SiteWrapper from "../../SiteWrapper"
import { refreshTokenAndOpenExportLinkInNewTab } from "../../../tools/refresh_token_and_open_export_link"
import { TOKEN_REFRESH } from "../../../queries/system/auth"
import { UPDATE_PAYMENT_BATCH, GET_PAYMENT_BATCHES_QUERY } from "./queries"
import { get_list_query_variables } from "./tools"


function FinancePaymentBatchViewBase({t, history, match, children, status}) {
  const batchId = match.params.id
  const batchType = match.params.batch_type
  const returnUrl = `/finance/paymentbatches/${batchType}`
  const exportUrl = `/d/export/finance_payment_batch/csv/${batchId}`
  const [disabled, setDisabled] = useState(false)

  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)
  const [updateFinancePaymentBatch] = useMutation(UPDATE_PAYMENT_BATCH)

  let sentToBankColor = "secondary"
  let approvedColor = "secondary"
  let awaitingApprovalColor = "secondary"
  let rejectedColor = "secondary"

  switch (status) {
    case "SENT_TO_BANK":
      sentToBankColor = "success"
      break
    case "APPROVED":
      approvedColor = "success"
      break
    case "AWAITING_APPROVAL":
      awaitingApprovalColor = "primary"
      break
    case "REJECTED":
      rejectedColor = "danger"
      break
    default:
      break
  }

  function onClickStatusButton(newStatus) {
    setDisabled(true)

    updateFinancePaymentBatch({ 
      variables: { input: {id: batchId, status: newStatus} }, 
      refetchQueries: [
        {query: GET_PAYMENT_BATCHES_QUERY, variables: get_list_query_variables(batchType)}
    ]})
    .then(({ data }) => {
        console.log('got data', data);
        toast.success((t('finance.payment_batches.toast_edit_status_success')), {
            position: toast.POSITION.BOTTOM_RIGHT
          })
        if (status !== "SENT_TO_BANK") {
          console.log(status)
          setDisabled(false)
        }
      }).catch((error) => {
        toast.error((t('general.toast_server_error')) +  error, {
            position: toast.POSITION.BOTTOM_RIGHT
          })
        console.log('there was an error sending the query', error)
        if (status !== "SENT_TO_BANK") {
          console.log(status)
          setDisabled(false)
        }
      })
  }

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")} subTitle={t('finance.payment_batch.title_view')}>
            <div className="page-options d-flex">
                <Link to={returnUrl} 
                      className='btn btn-secondary mr-2'>
                  <Icon prefix="fe" name="arrow-left" /> {t('general.back')}
                </Link>
                {/* Export as sold as excel sheet */}
                <Button
                  className='mr-2'
                  color="secondary"
                  RootComponent="a"
                  icon="download-cloud"
                  onClick={() => refreshTokenAndOpenExportLinkInNewTab(
                    t, doTokenRefresh, history, exportUrl
                  )}
                >
                  {t("general.export")}
                </Button>
                <Link to={`/finance/paymentbatches/${batchType}/edit/${batchId}`} 
                      className='btn btn-secondary'>
                  <Icon name="edit-2" /> {t('general.edit')}
                </Link>
            </div>
          </Page.Header>
            {(status) ? 
              (status === "SENT_TO_BANK") ?
                <Button.List>
                  <Button 
                    icon="mail"
                    disabled={true}
                    color={sentToBankColor}
                    onClick={() => onClickStatusButton("SENT_TO_BANK")}
                  >
                    {t('finance.payment_batch.status.SENT_TO_BANK')}
                  </Button>
                </Button.List>
              :
                <Grid.Row>
                  <Grid.Col md={12} className="mb-2 ">
                    

                    <Button.List className="float-right">
                      <Button 
                        icon="mail"
                        disabled={disabled}
                        color={sentToBankColor}
                        onClick={() => onClickStatusButton("SENT_TO_BANK")}
                      >
                        {t('finance.payment_batch.status.SENT_TO_BANK')}
                      </Button>
                      <Button 
                        icon="check"
                        disabled={disabled}
                        color={approvedColor}
                        onClick={() => onClickStatusButton("APPROVED")}
                      >
                        {t('finance.payment_batch.status.APPROVED')}
                      </Button>
                      <Button 
                        icon="clock"
                        disabled={disabled}
                        color={awaitingApprovalColor}
                        onClick={() => onClickStatusButton("AWAITING_APPROVAL")}
                      >
                        {t('finance.payment_batch.status.AWAITING_APPROVAL')}
                      </Button>
                      <Button 
                        icon="x"
                        disabled={disabled}
                        color={rejectedColor}
                        onClick={() => onClickStatusButton("REJECTED")}
                      >
                        {t('finance.payment_batch.status.REJECTED')}
                      </Button>
                    </Button.List>
                    <h6 className="float-right mr-2">{t("general.status")}</h6>
                  </Grid.Col>
                </Grid.Row>
              : ""
            }
          {children}
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(FinancePaymentBatchViewBase))