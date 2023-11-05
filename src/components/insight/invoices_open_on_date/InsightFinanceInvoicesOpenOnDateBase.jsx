import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import {
  Container,
  Grid,
  Page
} from "tabler-react";

import { OPEN_INVOICES_SCHEMA } from './yupSchema'
import { dateToLocalISO } from '../../../tools/date_tools'
import SiteWrapper from '../../SiteWrapper'
import FinanceInvoicesOpenOnDateFilter from "./InsightFinanceInvoicesOpenOnDateFilter"


function InsightFinanceInvoicesOpenOnDateBase ({ t, history, children, refetch=f=>f, setDate=f=>f }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("insight.title")} subTitle={t('insight.invoicesopenondate.title')}>
            <div className="page-options d-flex">
              {/* Page options here, if any */}
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={12}>
              <Formik 
                initialValues={{
                  date: new Date(),
                }}
                validationSchema={OPEN_INVOICES_SCHEMA}
                onSubmit={(values, { setSubmitting }) => {
                  refetch({
                    date: dateToLocalISO(values.date),
                  })
                  setDate(values.date)
                  setSubmitting(false)                  
                }}
              >
                {({ isSubmitting, errors, values, touched, handleChange, setFieldTouched, setFieldValue }) => (
                <FinanceInvoicesOpenOnDateFilter 
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

export default withTranslation()(withRouter(InsightFinanceInvoicesOpenOnDateBase))



// <Formik
// initialValues={{ 
//   relationCompany: initialData.financeInvoice.relationCompany, 
//   relationCompanyRegistration: initialData.financeInvoice.relationCompanyRegistration, 
//   relationCompanyTaxRegistration: initialData.financeInvoice.relationCompanyTaxRegistration, 
//   relationContactName: initialData.financeInvoice.relationContactName, 
//   relationAddress: initialData.financeInvoice.relationAddress, 
//   relationPostcode: initialData.financeInvoice.relationPostcode, 
//   relationCity: initialData.financeInvoice.relationCity, 
//   relationCountry: initialData.financeInvoice.relationCountry, 
// }}
// // validationSchema={INVOICE_GROUP_SCHEMA}
// onSubmit={(values, { setSubmitting, setTouched }) => {
//   console.log('submit values:')
//   console.log(values)

//   updateInvoice({ variables: {
//     input: {
//       id: match.params.id,
//       relationCompany: values.relationCompany,
//       relationCompanyRegistration: values.relationCompanyRegistration,
//       relationCompanyTaxRegistration: values.relationCompanyTaxRegistration,
//       relationContactName: values.relationContactName,
//       relationAddress: values.relationAddress,
//       relationPostcode: values.relationPostcode,
//       relationCity: values.relationCity,
//       relationCountry: values.relationCountry
//     }
//   }, refetchQueries: [
//       {query: GET_INVOICES_QUERY, variables: get_list_query_variables()}
//   ]})
//   .then(({ data }) => {
//       console.log('got data', data)
//       toast.success((t('finance.invoice.toast_edit_to_success')), {
//           position: toast.POSITION.BOTTOM_RIGHT
//         })
//       setSubmitting(false)
//       setTouched({})
//     }).catch((error) => {
//       toast.error((t('general.toast_server_error')) +  error, {
//           position: toast.POSITION.BOTTOM_RIGHT
//         })
//       console.log('there was an error sending the query', error)
//       setSubmitting(false)
//     })
//   }}
// >
// {({ isSubmitting, errors, values, touched, handleChange, setFieldTouched }) => (
//   <FinanceInvoiceEditToForm
//     isSubmitting={isSubmitting}
//     errors={errors}
//     values={values}
//     touched={touched}
//     handleChange={handleChange}
//     setFieldTouched={setFieldTouched}
//   >
//   </FinanceInvoiceEditToForm>
// )}
// </Formik>