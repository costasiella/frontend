import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import {
  Alert,
  Button,
  Card,
  Form,
} from "tabler-react"

import { GET_CLASSPASS_GROUPS_QUERY, ADD_CLASSPASS_GROUP } from './queries'
import { CLASSPASS_GROUP_SCHEMA } from './yupSchema'
import OrganizationClasspassesGroupsBase from './OrganizationClasspassesGroupsBase';


function OrganizationClasspassGroupAdd({t, history}) {
  const returnUrl = "/organization/classpasses/groups"
  const [ addClasspassGroup ] = useMutation(ADD_CLASSPASS_GROUP)

  return (
    <OrganizationClasspassesGroupsBase returnUrl={returnUrl}>
      <Card title={t('organization.classpass_groups.title_add')}>
        <Formik
          initialValues={{ name: '', description: '' }}
          validationSchema={CLASSPASS_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addClasspassGroup({ variables: {
                input: {
                  name: values.name, 
                  description: values.description, 
                }
              }, refetchQueries: [
                  {query: GET_CLASSPASS_GROUPS_QUERY}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('organization.classpass_groups.toast_add_success')), {
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
              <FoForm>
                  <Card.Body>
                    <Form.Group label={t('general.name')}>
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
                        color="primary"
                        className="pull-right" 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {t('general.submit')}
                      </Button>
                      <Link to={returnUrl}>
                        <Button color="link">
                            {t('general.cancel')}
                        </Button>
                      </Link>
                      {(isSubmitting) ? 
                        <Alert type="primary" hasExtraSpace>
                          <strong>{t('general.please_wait')}</strong> {t('organization.classpass_groups.toast_creating_might_take_a_while')}
                        </Alert> : 
                        ""
                      }
                  </Card.Footer>
              </FoForm>
          )}
        </Formik>
      </Card>
    </OrganizationClasspassesGroupsBase>
  )
}


export default withTranslation()(withRouter(OrganizationClasspassGroupAdd))