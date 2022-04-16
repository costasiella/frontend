import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_CLASSPASSES_QUERY, GET_CLASSPASS_QUERY, UPDATE_CLASSPASS } from './queries'
import { CLASSPASS_SCHEMA } from './yupSchema'

import {
  Card,
  Dimmer
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationClasspassesBase from './OrganizationClasspassesBase'
import OrganizationClasspassForm from "./OrganizationClasspassForm"


function OrganizationClasspassEdit({ t, match, history}) {
  const id = match.params.id
  const cardTitle = t('organization.classpasses.title_edit')
  const { loading, error, data } = useQuery(GET_CLASSPASS_QUERY, {
    variables: { id: id }
  })
  const [updateClasspass] = useMutation(UPDATE_CLASSPASS)

  if (loading) return (
    <OrganizationClasspassesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationClasspassesBase>
  )

  if (error) return (
    <OrganizationClasspassesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationClasspassesBase>
  )

  console.log('query data')
  console.log(data)
  const initialData = data

  let initialTaxRate = ""
  if (initialData.organizationClasspass.financeTaxRate) {
    initialTaxRate = initialData.organizationClasspass.financeTaxRate.id
  }

  let initialGlaccount = ""
  if (initialData.organizationClasspass.financeGlaccount) {
    initialGlaccount =  initialData.organizationClasspass.financeGlaccount.id
  } 

  let initialCostcenter = ""
  if (initialData.organizationClasspass.financeCostcenter) {
    initialCostcenter =  initialData.organizationClasspass.financeCostcenter.id
  } 

  return (
    <OrganizationClasspassesBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            displayPublic: initialData.organizationClasspass.displayPublic,
            displayShop: initialData.organizationClasspass.displayShop,
            trialPass: initialData.organizationClasspass.trialPass,
            name: initialData.organizationClasspass.name,
            description: initialData.organizationClasspass.description,
            price: initialData.organizationClasspass.price,
            financeTaxRate: initialTaxRate,
            validity: initialData.organizationClasspass.validity,
            validityUnit: initialData.organizationClasspass.validityUnit,
            classes: initialData.organizationClasspass.classes,
            unlimited: initialData.organizationClasspass.unlimited,
            quickStatsAmount: initialData.organizationClasspass.quickStatsAmount,
            financeGlaccount:  initialGlaccount,
            financeCostcenter: initialCostcenter
          }}
          validationSchema={CLASSPASS_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              updateClasspass({ variables: {
                input: {
                  id: match.params.id,
                  displayPublic: values.displayPublic,
                  displayShop: values.displayShop,
                  trialPass: values.trialPass,
                  name: values.name,
                  description: values.description,
                  price: values.price,
                  financeTaxRate: values.financeTaxRate,
                  validity: parseInt(values.validity),
                  validityUnit: values.validityUnit,
                  classes: parseInt(values.classes),
                  unlimited: values.unlimited,
                  quickStatsAmount: values.quickStatsAmount,
                  financeGlaccount: values.financeGlaccount,
                  financeCostcenter: values.financeCostcenter
                }
              }, refetchQueries: [
                  {query: GET_CLASSPASSES_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  toast.success((t('organization.classpasses.toast_edit_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  setSubmitting(false)
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, setFieldValue, setFieldTouched, errors, values }) => (
            <OrganizationClasspassForm 
              initialData = {initialData}
              isSubmitting = {isSubmitting}
              setFieldValue = {setFieldValue}
              setFieldTouched = {setFieldTouched}
              errors = {errors}
              values = {values}
            />
          )}
        </Formik>
      </Card>
    </OrganizationClasspassesBase>
  )
}


export default withTranslation()(withRouter(OrganizationClasspassEdit))