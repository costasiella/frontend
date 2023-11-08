import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import moment from 'moment'
import {
  Container,
  Grid,
  Page
} from "tabler-react";

import { TAX_SUMMARY_SCHEMA } from './yupSchema'
import { dateToLocalISO } from '../../../tools/date_tools'
import SiteWrapper from '../../SiteWrapper'
import FinanceTaxRatesSummaryFilter from "./FinanceTaxRatesSummaryFilter"


function FinanceTaxRatesSummaryBase ({ t, history, children, refetch }) {
  const dateStart = moment().startOf('month')
  const dateEnd   = moment().endOf('month')

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")} subTitle={t('finance.taxrates_summary.title')}>
            <div className="page-options d-flex">
              {/* Page header options here, if any */}
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={12}>
              <Formik 
                initialValues={{
                  dateStart: new Date(dateStart),
                  dateEnd: new Date(dateEnd)
                }}
                validationSchema={TAX_SUMMARY_SCHEMA}
                onSubmit={(values, { setSubmitting }) => {
                  refetch({
                    dateStart: dateToLocalISO(values.dateStart),
                    dateEnd: dateToLocalISO(values.dateEnd),
                  })
                  setSubmitting(false)                  
                }}
              >
                {({ isSubmitting, errors, values, touched, handleChange, setFieldTouched, setFieldValue }) => (
                <FinanceTaxRatesSummaryFilter 
                  isSubmitting={isSubmitting}
                  errors={errors}
                  values={values}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldTouched={setFieldTouched}
                  setFieldValue={setFieldValue}
                />
                )}
              </Formik>
              {children}
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(FinanceTaxRatesSummaryBase))
