import React, { useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'

import {
  Button,
  Card,
  Container,
  Icon,
  List,
  Page
} from "tabler-react"

import { refreshTokenAndOpenExportLinkInNewTab } from "../../../../tools/refresh_token_and_open_export_link"
import { TOKEN_REFRESH } from "../../../../queries/system/auth"
import AppSettingsContext from '../../../context/AppSettingsContext'
import SiteWrapper from '../../../SiteWrapper'
import { dateToLocalISO } from '../../../../tools/date_tools'
import ButtonBack from '../../../ui/ButtonBack';

import { INVOICES_EXPORT_SCHEMA } from './yupSchema'
import FinanceInvoicesExportForm from './FinanceInvoicesExportForm';
import moment from 'moment'


function FinanceInvoicesExport({t, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const [dateStart, setDateStart] = useState(new Date(moment().startOf('month')))
  const [dateEnd, setDateEnd] = useState(new Date(moment().endOf('month')))
  const [status, setStatus] = useState("ALL")
  const [prepared, setPrepared] = useState(false)
  const [exportUrl, setExportUrl] = useState("")

  const cardTitle = t("finance.invoices.export.title")
  const returnUrl = "/finance/invoices" 

  const [ doTokenRefresh ] = useMutation(TOKEN_REFRESH)

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")}>
            <div className="page-options d-flex">
              <ButtonBack returnUrl={returnUrl} />
            </div>
          </Page.Header>
          <Card title={cardTitle}>
            <Formik
            initialValues={{ 
              dateStart: dateStart,
              dateEnd: dateEnd,
              status: status
            }}
            validationSchema={INVOICES_EXPORT_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                setDateStart(values.dateStart)
                setDateEnd(values.dateEnd)
                setStatus(values.status)

                const isoDateStart = dateToLocalISO(values.dateStart)
                const isoDateEnd = dateToLocalISO(values.dateEnd)
                setExportUrl(
                  `/d/export/invoices/${isoDateStart}/${isoDateEnd}/${status}/`
                )
                
                setSubmitting(false)
                setPrepared(true)  
            }}
            >
            {({ isSubmitting, setFieldValue, setFieldTouched, errors, values, touched }) => (
              <FinanceInvoicesExportForm
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                errors={errors}
                values={values}
                returnUrl={returnUrl}
              />
              )
            }
          </Formik>
        </Card>
        {(prepared) ? 
          <Card title={t("finance.invoices.export.ready.title")}>
            <Card.Body>
              {t("finance.invoices.export.ready.explanation")}
              <List>
                <List.Item>
                  {t("general.period")}{ ": " } 
                  {moment(dateStart).format(dateFormat)} { " - " }
                  {moment(dateEnd).format(dateFormat)}
                </List.Item>
                <List.Item>
                  {t("general.status")}: {t(`finance.invoices.status.${status}`)}
                </List.Item>
              </List>
            </Card.Body>
            <Card.Footer>
              <Button 
                color="primary"
                onClick={() => refreshTokenAndOpenExportLinkInNewTab(
                  t, doTokenRefresh, history, exportUrl
                )}
              >
                <Icon name="download-cloud" /> {t("general.download")}
              </Button>
            </Card.Footer>
          </Card>
          : ""}
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(FinanceInvoicesExport))