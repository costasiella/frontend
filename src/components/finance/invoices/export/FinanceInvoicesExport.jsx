import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'

import {
  Card,
  Container,
  Page
} from "tabler-react"

import SiteWrapper from '../../../SiteWrapper'
import { dateToLocalISO, dateToLocalISOTime } from '../../../../tools/date_tools'
import ButtonBack from '../../../ui/ButtonBack';

// import { CLASS_SCHEMA } from './yupSchema'
import FinanceInvoicesExportForm from './FinanceInvoicesExportForm';


function FinanceInvoicesExport({t, history}) {
  const cardTitle = t('finance.invoices.export')
  const returnUrl = "/finance/invoices" 

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
              dateStart: new Date(),
              dateEnd: new Date(),
              status: "ALL"
            }}
            // validationSchema={CLASS_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                const dateStart = dateToLocalISO(values.dateStart)
                const dateEnd = dateToLocalISO(values.dateEnd)
                const status = values.status
                
            }}
            >
            {({ isSubmitting, setFieldValue, setFieldTouched, errors, values, touched }) => (
              <FinanceInvoicesExportForm
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                errors={errors}
                values={values}
                touched={touched}
                returnUrl={returnUrl}
              />
              )
            }
          </Formik>
        </Card>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(FinanceInvoicesExport))