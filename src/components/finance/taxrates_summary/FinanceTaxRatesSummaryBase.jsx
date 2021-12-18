// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import { Formik } from 'formik'

import moment from 'moment'

import {
  Container,
  Grid,
  Icon,
  Page
} from "tabler-react";

import { dateToLocalISO } from '../../../tools/date_tools'
import SiteWrapper from '../../SiteWrapper'
import FinanceTaxRatesSummaryFilter from "./FinanceTaxRatesSummaryFilter"
import FinanceMenu from "../FinanceMenu"


function FinanceTaxRatesSummaryBase ({ t, history, children, refetch }) {
  const dateStart = moment().startOf('month')
  const dateEnd   = moment().endOf('month')

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")}>
            <div className="page-options d-flex">
              {/* <Link to="/finance/invoices/groups" 
                    className='btn btn-outline-secondary btn-sm'>
                <Icon prefix="fe" name="folder" /> {t('general.groups')}
              </Link> */}
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
              {/* <h5 className="mt-2 pt-1">{t("general.filter")}</h5> */}
              <Formik 
                initialValues={{
                  dateStart: new Date(dateStart),
                  dateEnd: new Date(dateEnd)
                }}
                onSubmit={(values, { setSubmitting }) => {
                  console.log("hello world")

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
              <br /><br /><br />
              <h5>{t("general.menu")}</h5>
              <FinanceMenu activeLink='taxrates_summary'/>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(FinanceTaxRatesSummaryBase))



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