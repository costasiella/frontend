// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import { GET_CLASSPASS_GROUPS_QUERY, GET_CLASSPASS_GROUP_QUERY, UPDATE_CLASSPASS_GROUP } from './queries'
import { CLASSPASS_GROUP_SCHEMA } from './yupSchema'

import {
  Card,
  Dimmer,
  Button,
  Form
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationClasspassesGroupsBase from './OrganizationClasspassesGroupsBase';


function OrganizationClasspassGroupEdit({t, match, history}) {
  const id = match.params.id
  const cardTitle = t('organization.classpass_groups.title_edit')
  const returnUrl = "/organization/classpasses/groups"
  const { loading, error, data } = useQuery(GET_CLASSPASS_GROUP_QUERY, {
    variables: {id: id}
  })
  const [ updateClasspassGroup ] = useMutation(UPDATE_CLASSPASS_GROUP)

  // Loading
  if (loading) return (
    <OrganizationClasspassesGroupsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationClasspassesGroupsBase>
  )
  // Error
  if (error) return (
    <OrganizationClasspassesGroupsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationClasspassesGroupsBase>
  )
    

  const initialData = data.organizationClasspassGroup;
  console.log('query data')
  console.log(data)

  return (
    <OrganizationClasspassesGroupsBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            name: initialData.name, 
            description: initialData.description,
          }}
          validationSchema={CLASSPASS_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              updateClasspassGroup({ variables: {
                input: {
                  id: match.params.id,
                  name: values.name,
                  description: values.description,
                }
              }, refetchQueries: [
                  {query: GET_CLASSPASS_GROUPS_QUERY}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('organization.classpass_groups.toast_edit_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) + ': ' +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, errors, values }) => (
              <FoForm>
                  <Card.Body>    
                      <Form.Group label={t('general.name')} >
                        <Field type="text" 
                              name="name" 
                              className={(errors.name) ? "form-control is-invalid" : "form-control"} 
                              autoComplete="off" />
                        <ErrorMessage name="name" component="span" className="invalid-feedback" />
                      </Form.Group>
                      <Form.Group label={t('general.description')}>
                        <Field type="text" 
                                name="description" 
                                className={(errors.description) ? "form-control is-invalid" : "form-control"} 
                                autoComplete="off" />
                        <ErrorMessage name="name" component="span" className="invalid-feedback" />
                      </Form.Group>
                  </Card.Body>
                  <Card.Footer>
                      <Button 
                        className="pull-right"
                        color="primary"
                        disabled={isSubmitting}
                        type="submit"
                      >
                        {t('general.submit')}
                      </Button>
                      <Link to={returnUrl}>
                        <Button
                          type="button" 
                          color="link" 
                        >
                            {t('general.cancel')}
                        </Button>
                      </Link>
                  </Card.Footer>
              </FoForm>
          )}
        </Formik>
      </Card>
    </OrganizationClasspassesGroupsBase>
  )
}


export default withTranslation()(withRouter(OrganizationClasspassGroupEdit))