import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm } from 'formik'
import { Link } from 'react-router-dom'

import {
  Button,
  Card,
  Form,
  Grid
} from "tabler-react"

import { customFileInputLabelStyle } from "../../../tools/custom_file_input_label_style"


const RelationsAccountProfileImageForm = ({ t, history, isSubmitting, returnUrl, inputFileName, fileInputLabel, handleFileInputChange=f=>f }) => (
  <FoForm>
      <Card.Body>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.custom_file_input_label')}>
              <div className="custom-file">
                <input type="file" ref={inputFileName} className="custom-file-input" onChange={handleFileInputChange} />
                <label className="custom-file-label" style={customFileInputLabelStyle}>
                  {fileInputLabel}
                </label>
              </div>
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
      <Card.Footer>
          <Link to={returnUrl}>
            <Button color="link" className="pull-right">
              {t('general.cancel')}
            </Button>
          </Link>
          <Button 
            color="primary"
            // className="pull-right" 
            type="submit" 
            disabled={isSubmitting}
          >
            {t('general.submit')}
          </Button>

      </Card.Footer>
  </FoForm>
)

export default withTranslation()(withRouter(RelationsAccountProfileImageForm))

