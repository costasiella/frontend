import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_QUOTE_GROUPS_QUERY, GET_QUOTE_GROUP_QUERY, UPDATE_QUOTE_GROUP } from './queries'
import { QUOTE_GROUP_SCHEMA } from './yupSchema'

import {
  Card,
  Dimmer,
} from "tabler-react";

import ContentCard from "../../../general/ContentCard"
import FinanceQuoteGroupForm from './FinanceQuoteGroupForm'
import FinanceQuoteGroupsBase from './FinanceQuoteGroupsBase';


function FinanceQuoteGroupEdit({t, history, match}) {
  const id = match.params.id
  const returnUrl = "/finance/quotes/groups"
  const cardTitle = t('finance.quote_groups.title_edit')
  const { loading, error, data } = useQuery(GET_QUOTE_GROUP_QUERY, {
    variables: { id: id }
  })
  const [ updateQuoteGroup ] = useMutation(UPDATE_QUOTE_GROUP)

  if (loading) return (
    <FinanceQuoteGroupsBase showEditBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceQuoteGroupsBase>
  )

  if (error) return (
    <FinanceQuoteGroupsBase showEditBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('finance.quote_groups.error_loading')}</p>
      </ContentCard>
    </FinanceQuoteGroupsBase>
  )
                    
  const initialData = data.financeQuoteGroup;

  return (
    <FinanceQuoteGroupsBase showEditBack={true}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            name: initialData.name, 
            displayPublic: initialData.displayPublic,
            expiresAfterDays: initialData.expiresAfterDays,
            nextId: initialData.nextId,
            prefix: initialData.prefix,
            prefixYear: initialData.prefixYear,
            autoResetPrefixYear: initialData.autoResetPrefixYear,
            terms: initialData.terms,
            footer: initialData.footer,
            code: initialData.code
          }}
          validationSchema={QUOTE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              updateQuoteGroup({ variables: {
                input: {
                  id: match.params.id,
                  name: values.name, 
                  displayPublic: values.displayPublic,
                  nextId: parseInt(values.nextId),
                  expiresAfterDays: parseInt(values.expiresAfterDays),
                  prefix: values.prefix,
                  prefixYear: values.prefixYear,
                  autoResetPrefixYear: values.autoResetPrefixYear,
                  terms: values.terms,
                  footer: values.footer,
                  code: values.code
                }
              }, refetchQueries: [
                  {query: GET_QUOTE_GROUPS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('finance.quote_groups.toast_edit_success')), {
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
            <FinanceQuoteGroupForm
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
    </FinanceQuoteGroupsBase>
  )
}

export default withTranslation()(withRouter(FinanceQuoteGroupEdit))