import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { v4 } from "uuid"

import {
  Button,
  Card,
  Form,
  Grid
  } from "tabler-react"
import { Form as FoForm, Field, ErrorMessage } from 'formik'

import ButtonFormCancel from '../../ui/ButtonFormCancel'


const InsightInstructorClassesForm = ({ t, history, inputData, isSubmitting, setFieldValue, setFieldTouched, errors, values, returnUrl }) => (
    <FoForm>
      <Card.Body>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.year')}>
              <Field type="number" 
                      name="year" 
                      className={(errors.year) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="year" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('general.month')}>
              <Field component="select" 
                    name="month" 
                    className={(errors.month) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off"
              >
                <option value="01" key={v4()}>{t("datetime.months.january")}</option>
                <option value="02" key={v4()}>{t("datetime.months.february")}</option>
                <option value="03" key={v4()}>{t("datetime.months.march")}</option>
                <option value="04" key={v4()}>{t("datetime.months.april")}</option>
                <option value="05" key={v4()}>{t("datetime.months.may")}</option>
                <option value="06" key={v4()}>{t("datetime.months.june")}</option>
                <option value="07" key={v4()}>{t("datetime.months.july")}</option>
                <option value="08" key={v4()}>{t("datetime.months.august")}</option>
                <option value="09" key={v4()}>{t("datetime.months.september")}</option>
                <option value="10" key={v4()}>{t("datetime.months.october")}</option>
                <option value="11" key={v4()}>{t("datetime.months.november")}</option>
                <option value="12" key={v4()}>{t("datetime.months.december")}</option>
              </Field>
              <ErrorMessage name="month" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('general.instructor')}>
              <Field component="select" 
                    name="instructor" 
                    className={(errors.instructor) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off">
                <option value="" key={v4()}>{t("general.please_select")}</option>
                {inputData.instructors.edges.map(({ node }) =>
                  <option value={node.id} key={v4()}>{node.fullName}</option>
                )}
              </Field>
              <ErrorMessage name="instructor" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Button 
                color="primary"
                className="pull-right" 
                type="submit" 
                disabled={isSubmitting}
            >
              {t('insight.instructor_classes_month.find_classes')}
            </Button>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
      {/* <Card.Footer> 

        <ButtonFormCancel returnUrl={returnUrl} />
      </Card.Footer> */}
    </FoForm>
)
  
  
  export default withTranslation()(withRouter(InsightInstructorClassesForm))