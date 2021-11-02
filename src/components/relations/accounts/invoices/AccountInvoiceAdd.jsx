// @flow

import React, {Component } from 'react'
import { gql } from "@apollo/client"
import { useQuery, useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_ACCOUNT_SUBSCRIPTIONS_QUERY, GET_INPUT_VALUES_QUERY, CREATE_ACCOUNT_INVOICE } from './queries'
import { SUBSCRIPTION_SCHEMA } from './yupSchema'
import AccountInvoiceAddForm from './AccountInvoiceAddForm'

import {
  Page,
  Grid,
  Icon,
  Button,
  Card,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"
import HasPermissionWrapper from "../../../HasPermissionWrapper"
import { dateToLocalISO } from '../../../../tools/date_tools'

import RelationsAccountProfileBase from '../RelationsAccountProfileBase'
import ProfileMenu from "../ProfileMenu"



function AccountInvoiceAdd({ t, match, history }) {
  const account_id = match.params.account_id
  const activeLink = "invoices"
  const cardTitle = t('relations.account.invoices.title_add')
  const returnUrl = `/relations/accounts/${account_id}/invoices`
  const sidebarButton = <Link to={returnUrl}>
      <Button color="primary btn-block mb-6">
        <Icon prefix="fe" name="chevrons-left" /> {t('general.back')}
      </Button>
    </Link>

  const { loading, error, data } = useQuery(GET_INPUT_VALUES_QUERY, {
      variables: {
        accountId: account_id
      }
    }
  )
  const [createInvoice] = useMutation(CREATE_ACCOUNT_INVOICE, {
    // onCompleted = () => history.push('/finance/invoices/edit/')
  }) 

  // Query
  // Loading
  if (loading) {
    return <RelationsAccountProfileBase activeLink={activeLink} sidebarButton={sidebarButton}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.loading_with_dots')}</p>
          </Card.Body>
        </Card>
      </RelationsAccountProfileBase>
  }
  // Error
  if (error) {
    console.log(error)
    return <RelationsAccountProfileBase activeLink={activeLink} sidebarButton={sidebarButton}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.error_sad_smiley')}</p>
          </Card.Body>
        </Card>
      </RelationsAccountProfileBase>
  }
  
  console.log(data)
  const account = data.account


  return (
    <RelationsAccountProfileBase activeLink={activeLink} user={account} sidebarButton={sidebarButton}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{
            financeInvoiceGroup: "",
            summary: ""
          }}
          // validationSchema={INVOICE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            createInvoice({ variables: {
              input: {
                account: account_id, 
                financeInvoiceGroup: values.financeInvoiceGroup,
                summary: values.summary
              }
            }, refetchQueries: [
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('relations.account.invoices.title_add')), {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                history.push('/finance/invoices/edit/' + data.createFinanceInvoice.financeInvoice.id)
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
          {({ isSubmitting, errors, values, submitForm, setFieldTouched, setFieldValue }) => (
            <AccountInvoiceAddForm
              inputData={data}
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              submitForm={submitForm}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              return_url={returnUrl}
            >
            </AccountInvoiceAddForm>   
          )}
        </Formik>
      </Card>
    </RelationsAccountProfileBase>

    // <SiteWrapper>
    //   <div className="my-3 my-md-5">
    //     <Container>
    //       <Page.Header title={account.firstName + " " + account.lastName} />
    //       <Grid.Row>
    //           <Grid.Col md={9}>
                
    //           </Grid.Col>
    //           <Grid.Col md={3}>
    //             <ProfileMenu 
    //               activeLink='invoices'
    //               accountId={match.params.account_id}
    //             />
    //           </Grid.Col>
    //         </Grid.Row>
    //       </Container>
    //   </div>
    // </SiteWrapper>
  )
}


export default withTranslation()(withRouter(AccountInvoiceAdd))
