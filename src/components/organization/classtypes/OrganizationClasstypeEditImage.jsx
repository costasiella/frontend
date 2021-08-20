// @flow

import React, { useState, useRef } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { 
  Formik,
  Form as FoForm, 
  Field, 
  ErrorMessage 
} from 'formik'


import { GET_CLASSTYPES_QUERY, GET_CLASSTYPE_QUERY, UPDATE_CLASSTYPE_IMAGE } from './queries'
import { CLASSTYPE_SCHEMA } from './yupSchema'

import {
  Dimmer,
  Grid,
  Icon,
  Button,
  Card,
  Container,
  Form,
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationClasstypesBase from './OrganizationClasstypesBase';


const customFileInputLabelStyle = {
  whiteSpace: "nowrap",
  display: "block",
  overflow: "hidden"
}


function OrganizationClasstypeEditImage({t, history, match}) {
  const classtypeId = match.params.id
  const returnUrl = "/organization/classtypes"
  const cardTitle = t('organization.classtypes.edit_image')
  const { loading, error, data } = useQuery(GET_CLASSTYPE_QUERY, {
    variables: { id: classtypeId }
  })
  const [ uploadImage ] = useMutation(UPDATE_CLASSTYPE_IMAGE)

  // Vars for document file input field start
  const [fileName, setFileName] = useState("")
  const inputFileName = useRef(null)
  const fileInputLabel = fileName || t("general.custom_file_input_inner_label")

  const handleFileInputChange = (event) => {
    console.log('on change triggered')
    setFileName(event.target.files[0].name)

    console.log(inputFileName)
    console.log(inputFileName.current)
    console.log(inputFileName.current.files)
  }

  if (loading) return (
    <OrganizationClasstypesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationClasstypesBase>
  )
  // Error
  if (error) return (
    <OrganizationClasstypesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationClasstypesBase>
  )

  const initialData = data.organizationClasstype
  console.log('query data')
  console.log(data)

  return (
    <OrganizationClasstypesBase>
      <Card title={cardTitle}>
       <Formik
          initialValues={{}}
          // validationSchema={DOCUMENT_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            let reader = new FileReader()
            reader.onload = function(reader_event) {
              console.log(reader_event.target.result)
              let b64_enc_image = reader_event.target.result

              uploadImage({ variables: {
                input: {
                  id: classtypeId,
                  image: b64_enc_image
                }
              }, refetchQueries: [
                  {query: GET_CLASSTYPES_QUERY, variables: {"archived": true }},
                  {query: GET_CLASSTYPES_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('organization.classtypes.toast_image_save_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) + ': ' +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error);
                })
            }
            let file = inputFileName.current.files[0]
            reader.readAsDataURL(file)
          }}
          >
          {({ isSubmitting, errors, values }) => (
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
            </Card.Footer>
          </FoForm>
          )}
        </Formik>
      </Card>
    </OrganizationClasstypesBase>
  )
}







// <Form autoComplete="off" onSubmit={(event) => this.onSubmit(event, initialData.id, uploadImage)}>
// <Card.Body>
//   <Form.Group label={t('general.custom_file_input_label')}>
//     <div className="custom-file">
//       <input type="file" ref={this.fileInput} className="custom-file-input" onChange={this._handleOnChange} />
//       <label className="custom-file-label" style={customFileInputLabelStyle}>
//         {fileInputLabel}
//       </label>
//     </div>
//   </Form.Group>
// </Card.Body>
// <Card.Footer>
//   <Button 
//     className="pull-right"
//     color="primary"
//     type="submit"
//   >
//     {t('general.submit')}
//   </Button>
//   <Link to={returnUrl}>
//     <Button
//       type="button" 
//       color="link" 
//     >
//         {t('general.cancel')}
//     </Button>
//   </Link>
// </Card.Footer>
// </Form>












// class OrganizationClasstypeEditImage extends Component {
//   constructor(props) {
//     super(props)
//     console.log("Organization classtype image edit props:")
//     console.log(props)
//     this.fileInput = React.createRef()
//     // this.fileInputPreview = React.createRef()
//   }

//   state = {
//     fileName: "",
//   }

//   onSubmit(e, id, uploadImage) {
//     e.preventDefault()
//     const t = this.props.t
//     console.log(id)

//     console.log(e.target.name + 'clicked')

//     var file = this.fileInput.current.files[0]
//     console.log(file)
//     let reader = new FileReader()

//     // console.log(reader.readAsDataURL(file))

//     reader.onload = function(reader_event) {
//       console.log(reader_event.target.result)
//       let b64_enc_image = reader_event.target.result

//       uploadImage({ variables: {
//         input: {
//           id: id,
//           image: b64_enc_image
//         }
//       }, refetchQueries: [
//           {query: GET_CLASSTYPES_QUERY, variables: {"archived": false }}
//       ]})
//       .then(({ data }) => {
//           console.log('got data', data)
//           toast.success((t('organization.classtypes.toast_image_save_success')), {
//               position: toast.POSITION.BOTTOM_RIGHT
//             })
//         }).catch((error) => {
//           toast.error((t('general.toast_server_error')) + ': ' +  error, {
//               position: toast.POSITION.BOTTOM_RIGHT
//             })
//           console.log('there was an error sending the query', error);
//         })
      
//     }
//     reader.readAsDataURL(file)
//   }

//   // previewFile() {
//   //     var preview = this.ref.fileInputPreview.current
//   //     var file    = this.fileInput.current.files[0]
//   //     var reader  = new FileReader();
    
//   //     reader.addEventListener("load", function () {
//   //       preview.src = reader.result;
//   //     }, false);
    
//   //     if (file) {
//   //       reader.readAsDataURL(file);
//   //     }
//   //   }

//   _handleOnChange = (event) => {
//     console.log('on change triggered')
//     this.setState({ fileName: event.target.files[0].name });
//   }


//   render() {
//     const t = this.props.t
//     const match = this.props.match
//     const history = this.props.history
//     const id = match.params.id
//     const return_url = "/organization/classtypes"
//     const fileInputLabel = this.state.fileName || t("general.custom_file_input_inner_label")

//     return (
//       <SiteWrapper>
//         <div className="my-3 my-md-5">
//           <Container>
//             <Page.Header title="Organization" />
//             <Grid.Row>
//               <Grid.Col md={9}>
              
//               </Grid.Col>
//               <Grid.Col md={3}>
//                 <HasPermissionWrapper permission="change"
//                                       resource="organizationclasstype">
//                   <Button color="primary btn-block mb-6"
//                           onClick={() => history.push(return_url)}>
//                     <Icon prefix="fe" name="chevrons-left" /> {t('general.back')}
//                   </Button>
//                 </HasPermissionWrapper>
//                 <OrganizationMenu activeLink='classtypes'/>
//               </Grid.Col>
//             </Grid.Row>
//           </Container>
//         </div>
//     </SiteWrapper>
//     )}
//   }


export default withTranslation()(withRouter(OrganizationClasstypeEditImage))