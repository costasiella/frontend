import React from 'react'
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Page,
  Grid,
  Icon,
  Button,
  Card,
  Container,
} from "tabler-react"

import { GET_BUSINESSES_QUERY } from './queries'
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"
import ButtonBack from '../../ui/ButtonBack';

import { get_list_query_variables } from "./tools"
import RelationsB2BAddForm from "./RelationB2BAddForm"


const ADD_BUSINESS = gql`
  mutation CreateBusiness($input:CreateBusinessInput!) {
    createBusiness(input: $input) {
      business {
        id
      }
    }
  }
`

const returnUrl = "/relations/b2b"

function RelationsB2BAdd({ t, history }) {
  const [addBusiness] = useMutation(ADD_BUSINESS)
  
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t('relations.title')} >
            <div className='page-options d-flex'>
              <ButtonBack returnUrl={returnUrl} />
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={12}>
            <Card>
              <Card.Header>
                <Card.Title>{t('relations.b2b.title_add')}</Card.Title>
              </Card.Header>
                <Formik
                    initialValues={{ name: '' }}
                    // validationSchema={B2BADD_SCHEMA}
                    onSubmit={(values, { setSubmitting }) => {
                        addBusiness({ variables: {
                          input: {
                            name: values.name,
                            b2b: true
                          }
                        }, refetchQueries: [
                            {query: GET_BUSINESSES_QUERY, variables: get_list_query_variables()}
                        ]})
                        .then(({ data }) => {
                            console.log('got data', data)
                            const businessId = data.createBusiness.business.id
                            history.push(`/relations/b2b/${businessId}/edit`)
                            toast.success((t('relations.b2b.toast_add_success')), {
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
                    {({ isSubmitting, errors }) => (
                        <RelationsB2BAddForm
                          isSubmitting={isSubmitting}
                          errors={errors}
                          returnUrl={returnUrl}
                        />
                    )}
                </Formik>
            </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(RelationsB2BAdd))