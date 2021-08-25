// @flow

import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { UPDATE_INVOICE_ITEM } from "../queries"
import FinanceInvoiceItemEditForm from './FinanceInvoiceItemEditForm'


function FinanceInvoiceItemEdit({t, initialValues, node, inputData}) {
  const [updateInvoiceItem, { data }] = useMutation(UPDATE_INVOICE_ITEM)

    return (
      <Formik
        initialValues={{
          productName: initialValues.productName,
          description: initialValues.description,
          price: initialValues.price,
          quantity: initialValues.quantity,
          financeTaxRate: (initialValues.financeTaxRate) ? initialValues.financeTaxRate.id : null
        }}
        // validationSchema={INVOICE_GROUP_SCHEMA}
        onSubmit={(values, { setSubmitting, setTouched }) => {
          console.log('submit values:')
          console.log(values)

          updateInvoiceItem({ variables: {
            input: {
              id: initialValues.id,
              productName: values.productName, 
              description: values.description,
              price: values.price,
              quantity: values.quantity,
              financeTaxRate: values.financeTaxRate
            }
          }, refetchQueries: [
              // {query: GET_INVOICES_QUERY, variables: get_list_query_variables()}
          ]})
          .then(({ data }) => {
              console.log('got data', data)
              toast.success((t('finance.invoice.item.toast_edit_success')), {
                  position: toast.POSITION.BOTTOM_RIGHT
                })
              setSubmitting(false)
              setTouched({})
            }).catch((error) => {
              toast.error((t('general.toast_server_error')) + ': ' +  error, {
                  position: toast.POSITION.BOTTOM_RIGHT
                })
              console.log('there was an error sending the query', error)
              setSubmitting(false)
            })
          }}
      >
        {({ isSubmitting, errors, values, touched, handleChange, setFieldTouched }) => (
          <FinanceInvoiceItemEditForm
            isSubmitting={isSubmitting}
            errors={errors}
            values={values}
            touched={touched}
            handleChange={handleChange}
            setFieldTouched={setFieldTouched}
            node={node}
            inputData={inputData}
          >
          </FinanceInvoiceItemEditForm>   
        )}
      </Formik>
    )
}


export default withTranslation()(withRouter(FinanceInvoiceItemEdit))