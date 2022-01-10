// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { gql } from "@apollo/client"
import { v4 } from "uuid"
import { Formik } from 'formik'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'


import {
  Page,
  Grid,
  Icon,
  Dimmer,
  Container,
  Table,
} from "tabler-react";
import SiteWrapper from "../../../../SiteWrapper"
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
// import { confirmAlert } from 'react-confirm-alert'; // Import
import { toast } from 'react-toastify'

import ContentCard from "../../../../general/ContentCard"
import FinanceInvoiceGroupDefaultsBase from './FinanceInvoiceGroupDefaultsBase'
import FinanceInvoiceGroupDefaultForm from './FinanceInvoiceGroupDefaultForm'

import { INVOICE_GROUP_DEFAULT_SCHEMA } from "./yupSchema"
import { GET_INVOICE_GROUPS_QUERY } from "../queries"
import { GET_INVOICE_GROUPS_DEFAULTS_QUERY, UPDATE_INVOICE_GROUP_DEFAULT } from "./queries"


const fetch_default_type_name = (t, itemType) => {
  switch(itemType) {
    case "MEMBERSHIPS":
      return t('finance.invoice_groups_defaults.MEMBERSHIPS')
      break
    case "SUBSCRIPTIONS":
      return t('finance.invoice_groups_defaults.SUBSCRIPTIONS')
      break
    case "CLASSPASSES":
      return t('finance.invoice_groups_defaults.CLASSPASSES')
      break
    case "DROPINCLASSES":
      return t('finance.invoice_groups_defaults.DROPINCLASSES')
      break
    case "TRIALCLASSES":
      return t('finance.invoice_groups_defaults.TRIALCLASSES')
      break
    case "EVENT_TICKETS":
      return t('finance.invoice_groups_defaults.EVENT_TICKETS')
      break
    case "SHOP_SALES":
      return t('finance.invoice_groups_defaults.SHOP_SALES')
      break
    case "INSTRUCTOR_PAYMENTS":
      return t('finance.invoice_groups_defaults.INSTRUCTOR_PAYMENTS')
      break
    case "EMPLOYEE_EXPENSES":
      return t('finance.invoice_groups_defaults.EMPLOYEE_EXPENSES')
      break
    default:
      return t('finance.invoice_groups_defaults.TYPE_NOT_FOUND')
  }
}



function FinanceInvoiceGroupsDefaults({ t, history }) {
  const { loading, error, data, fetchMore } = useQuery(GET_INVOICE_GROUPS_DEFAULTS_QUERY, {
    variables: { archived: false }
  })

  const [updateDefaultGroup] = useMutation(UPDATE_INVOICE_GROUP_DEFAULT)

  // Loading
  if (loading) return (
    <FinanceInvoiceGroupDefaultsBase>
      <ContentCard cardTitle={t('finance.invoice_groups_defaults.title')}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceInvoiceGroupDefaultsBase>
  )
  // Error
  if (error) return (
    <FinanceInvoiceGroupDefaultsBase>
      <ContentCard cardTitle={t('finance.invoice_groups_defaults.title')}>
        <p>{t('finance.invoice_groups_defaults.error_loading')}</p>
      </ContentCard>
    </FinanceInvoiceGroupDefaultsBase>
  )

  const financeInvoiceGroupDefaults = data.financeInvoiceGroupDefaults
  
  // Empty list
  if (!financeInvoiceGroupDefaults.edges.length) { return (
    <FinanceInvoiceGroupDefaultsBase>
      <ContentCard cardTitle={t('finance.invoice_groups_defaults.title')}>
        <p>
          {t('finance.invoice_groups_defaults.empty_list')}
        </p>
      </ContentCard>
    </FinanceInvoiceGroupDefaultsBase>
  )} 

  return (
    <FinanceInvoiceGroupDefaultsBase>
      <ContentCard cardTitle={t('finance.invoice_groups_defaults.title')}
                  pageInfo={financeInvoiceGroupDefaults.pageInfo}
                  onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: financeInvoiceGroupDefaults.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.financeInvoiceGroups.edges
                        const pageInfo = fetchMoreResult.financeInvoiceGroups.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new invoice_groups_defaults at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              financeInvoiceGroups: {
                                __typename: previousResult.financeInvoiceGroups.__typename,
                                edges: [ ...previousResult.financeInvoiceGroups.edges, ...newEdges ],
                                pageInfo
                              }
                            }
                          : previousResult
                      }
                    })
                  }} 
        >
        <Table>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('finance.invoice_groups_defaults.item_type')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.invoice_groups_defaults.invoice_group')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {financeInvoiceGroupDefaults.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    { fetch_default_type_name(t, node.itemType) }
                  </Table.Col>
                  <Table.Col>
                    <Formik
                      initialValues={{ 
                        financeInvoiceGroup:node.financeInvoiceGroup.id
                      }}
                      validationSchema={INVOICE_GROUP_DEFAULT_SCHEMA}
                      onSubmit={(values, { setSubmitting }) => {
                          console.log('submit values:')
                          console.log(values)

                          updateDefaultGroup({ variables: {
                            input: {
                              id: node.id,
                              financeInvoiceGroup: values.financeInvoiceGroup
                            }
                          }, refetchQueries: [
                              // {query: GET_INVOICE_GROUPS_QUERY, variables: {"archived": false }}
                          ]})
                          .then(({ data }) => {
                              console.log('got data', data)
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
                      {({ isSubmitting, errors, values, setFieldTouched, setFieldValue, submitForm }) => (
                        <FinanceInvoiceGroupDefaultForm
                          inputData={data}
                          isSubmitting={isSubmitting}
                          errors={errors}
                          values={values}
                          setFieldTouched={setFieldTouched}
                          setFieldValue={setFieldValue}
                          submitForm={submitForm}
                        />
                      )}
                    </Formik>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </FinanceInvoiceGroupDefaultsBase>
  )
};

export default withTranslation()(withRouter(FinanceInvoiceGroupsDefaults))