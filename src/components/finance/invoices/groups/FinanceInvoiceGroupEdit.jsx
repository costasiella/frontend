// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_INVOICE_GROUPS_QUERY, GET_INVOICE_GROUP_QUERY, UPDATE_INVOICE_GROUP } from './queries'
import { INVOICE_GROUP_SCHEMA } from './yupSchema'

import {
  Card,
  Dimmer,
} from "tabler-react";

import ContentCard from "../../../general/ContentCard"
import FinanceInvoiceGroupForm from './FinanceInvoiceGroupForm'
import FinanceInvoiceGroupsBase from './FinanceInvoiceGroupsBase';


function FinanceInvoiceGroupEdit({t, history, match}) {
  const id = match.params.id
  const returnUrl = "/finance/invoices/groups"
  const cardTitle = t('finance.invoice_groups.title_edit')
  const { loading, error, data } = useQuery(GET_INVOICE_GROUP_QUERY, {
    variables: { id: id }
  })
  const [ updateInvoiceGroup ] = useMutation(UPDATE_INVOICE_GROUP)

  if (loading) return (
    <FinanceInvoiceGroupsBase showEditBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceInvoiceGroupsBase>
  )

  if (error) return (
    <FinanceInvoiceGroupsBase showEditBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('finance.invoice_groups.error_loading')}</p>
      </ContentCard>
    </FinanceInvoiceGroupsBase>
  )
                    
  const initialData = data.financeInvoiceGroup;
  console.log('query data')
  console.log(data)

  return (
    <FinanceInvoiceGroupsBase showEditBack={true}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            name: initialData.name, 
            displayPublic: initialData.displayPublic,
            dueAfterDays: initialData.dueAfterDays,
            nextId: initialData.nextId,
            prefix: initialData.prefix,
            prefixYear: initialData.prefixYear,
            autoResetPrefixYear: initialData.autoResetPrefixYear,
            terms: initialData.terms,
            footer: initialData.footer,
            code: initialData.code
          }}
          validationSchema={INVOICE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              updateInvoiceGroup({ variables: {
                input: {
                  id: match.params.id,
                  name: values.name, 
                  displayPublic: values.displayPublic,
                  nextId: values.nextId,
                  dueAfterDays: values.dueAfterDays,
                  prefix: values.prefix,
                  prefixYear: values.prefixYear,
                  autoResetPrefixYear: values.autoResetPrefixYear,
                  terms: values.terms,
                  footer: values.footer,
                  code: values.code
                }
              }, refetchQueries: [
                  {query: GET_INVOICE_GROUPS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('finance.invoice_groups.toast_edit_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
            <FinanceInvoiceGroupForm
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              returnUrl={returnUrl}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              edit={true}
            />
          )}
        </Formik>
      </Card>
    </FinanceInvoiceGroupsBase>
  )
}

export default withTranslation()(withRouter(FinanceInvoiceGroupEdit))