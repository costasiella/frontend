// @flow

import React, {Component } from 'react'
import { gql } from "@apollo/client"
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Dimmer,
} from "tabler-react";

import { GET_SCHEDULE_ITEM_PRICES_QUERY, GET_SINGLE_SCHEDULE_ITEM_PRICE_QUERY, UPDATE_SCHEDULE_ITEM_PRICE } from './queries'
import { SCHEDULE_CLASS_INSTRUCTOR_SCHEMA } from './yupSchema'
import ScheduleClassPriceForm from './ScheduleClassPriceForm'
import { dateToLocalISO } from '../../../../../tools/date_tools'

import ClassEditBase from "../ClassEditBase"
import ScheduleClassPriceBack from "./ScheduleClassPriceBack"

function ScheduleClassPriceEdit({ t, history, match }) {
  const id = match.params.id
  const classId = match.params.class_id
  const returnUrl = `/schedule/classes/all/prices/${classId}`
  const menuActiveLink = "prices"
  const cardTitle = t('schedule.classes.prices.title_edit')
  const sidebarButton = <ScheduleClassPriceBack classId={match.params.class_id} />
  const { loading, error, data, } = useQuery(GET_SINGLE_SCHEDULE_ITEM_PRICE_QUERY, {
    variables: {
      id: id
    }
  })
  const [editScheduleClassPrice] = useMutation(UPDATE_SCHEDULE_ITEM_PRICE, {
    onCompleted: () => history.push(returnUrl)
  })


  if (loading) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={sidebarButton}
    >
      <Dimmer active={true} loader={true} />
    </ClassEditBase>
  )
  // Error
  if (error) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={sidebarButton}
    >
      <p>{t('general.error_sad_smiley')}</p>
    </ClassEditBase>
  )


  console.log('query data')
  console.log(data)
  const inputData = data

  let initialOrganizationClasspassDropin
  let initialOrganizationClasspassTrial

  if (inputData.scheduleItemPrice.organizationClasspassDropin) {
    initialOrganizationClasspassDropin = inputData.scheduleItemPrice.organizationClasspassDropin.id
  }

  if (inputData.scheduleItemPrice.organizationClasspassTrial) {
    initialOrganizationClasspassTrial = inputData.scheduleItemPrice.organizationClasspassTrial.id
  }

  // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateStart = null
  let dateEnd = null
  if (inputData.scheduleItemPrice.dateStart) {
    dateStart = new Date(inputData.scheduleItemPrice.dateStart)
  }
  if (inputData.scheduleItemPrice.dateEnd) {
    dateEnd = new Date(inputData.scheduleItemPrice.dateEnd)
  }


  return (
  <ClassEditBase 
    cardTitle={cardTitle}
    menu_activeLink={menuActiveLink}
    sidebarButton={sidebarButton}
  >
    <Formik
      initialValues={{ 
        dateStart: dateStart,
        dateEnd: dateEnd,
        organizationClasspassDropin: initialOrganizationClasspassDropin,
        organizationClasspassTrial: initialOrganizationClasspassTrial,
      }}
      // validationSchema={SCHEDULE_CLASS_INSTRUCTOR_SCHEMA}
      onSubmit={(values, { setSubmitting }) => {

          let dateEnd
          if (values.dateEnd) {
            dateEnd = dateToLocalISO(values.dateEnd)
          } else {
            dateEnd = values.dateEnd
          }

          editScheduleClassPrice({ variables: {
            input: {
              id: id,
              dateStart: dateToLocalISO(values.dateStart),
              dateEnd: dateEnd,
              organizationClasspassDropin: values.organizationClasspassDropin,
              organizationClasspassTrial: values.organizationClasspassTrial
            }
          }, refetchQueries: [
              {query: GET_SCHEDULE_ITEM_PRICES_QUERY, variables: { scheduleItem: match.params.class_id }},
              // {query: GET_SUBSCRIPTIONS_QUERY, variables: {"archived": false }},
          ]})
          .then(({ data }) => {
              console.log('got data', data);
              toast.success((t('schedule.classes.prices.toast_edit_success')), {
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
        <ScheduleClassPriceForm
          inputData={inputData}
          isSubmitting={isSubmitting}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          errors={errors}
          values={values}
          returnUrl={returnUrl + match.params.class_id}
        />
      )}
  </Formik>
</ClassEditBase>
  )
}


// class ScheduleClassInstructorEdit extends Component {
//   constructor(props) {
//     super(props)
//     console.log("Schedule class instructor edit props:")
//     console.log(props)
//   }

//   render() {
//     const t = this.props.t
//     const match = this.props.match
//     const history = this.props.history
//     const id = match.params.id
//     const class_id = match.params.class_id
//     const returnUrl = "/schedule/classes/all/instructors/" + class_id

//     return (
//       <SiteWrapper>
//         <div className="my-3 my-md-5">
//           <Query query={GET_SINGLE_SCHEDULE_CLASS_ACCOUNTS_QUERY} variables={{id: id}}>
//             {({ loading, error, data, refetch }) => {
//               // Loading
//               if (loading) return <p>{t('general.loading_with_dots')}</p>
//               // Error
//               if (error) {
//                 console.log(error)
//                 return <p>{t('general.error_sad_smiley')}</p>
//               }
    
//               console.log('query data')
//               console.log(data)
//               const inputData = data
//               const initialData = data.scheduleItemAccount

//               let initialAccount2 = ""
//               if (initialData.account2) {
//                 initialAccount2 =  initialData.account2.id
//               } 
    
//               return (
//                 <ClassEditBase 
//                   card_title={t('schedule.classes.instructors.title_edit')}
//                   menu_activeLink="instructors"
//                   sidebar_button={<ScheduleClassInstructorBack classId={class_id} />}
//                 >
//                   <Mutation mutation={UPDATE_SCHEDULE_CLASS_INSTRUCTOR} onCompleted={() => history.push(returnUrl)}> 
//                     {(addScheduleClassInstructor, { data }) => (
//                         <Formik
//                             initialValues={{  
//                               dateStart: initialData.dateStart,
//                               dateEnd: initialData.dateEnd,
//                               account: initialData.account.id,
//                               role: initialData.role,
//                               account2: initialAccount2,
//                               role2: initialData.role2,
//                             }}
//                             validationSchema={SCHEDULE_CLASS_INSTRUCTOR_SCHEMA}
//                             onSubmit={(values, { setSubmitting }) => {
    
//                                 let dateEnd
//                                 if (values.dateEnd) {
//                                   dateEnd = dateToLocalISO(values.dateEnd)
//                                 } else {
//                                   dateEnd = values.dateEnd
//                                 }
    
//                                 addScheduleClassInstructor({ variables: {
//                                   input: {
//                                     id: match.params.id,
//                                     account: values.account,
//                                     role: values.role,
//                                     account2: values.account2,
//                                     role2: values.role2,
//                                     dateStart: dateToLocalISO(values.dateStart),
//                                     dateEnd: dateEnd
//                                   }
//                                 }, refetchQueries: [
//                                     {query: GET_SCHEDULE_CLASS_ACCOUNTS_QUERY, variables: { scheduleItem: match.params.class_id }},
//                                     // {query: GET_SUBSCRIPTIONS_QUERY, variables: {"archived": false }},
//                                 ]})
//                                 .then(({ data }) => {
//                                     console.log('got data', data);
//                                     toast.success((t('schedule.classes.instructors.toast_edit_success')), {
//                                         position: toast.POSITION.BOTTOM_RIGHT
//                                       })
//                                   }).catch((error) => {
//                                     toast.error((t('general.toast_server_error')) +  error, {
//                                         position: toast.POSITION.BOTTOM_RIGHT
//                                       })
//                                     console.log('there was an error sending the query', error)
//                                     setSubmitting(false)
//                                   })
//                             }}
//                             >
//                             {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
//                               <ScheduleClassInstructorForm
//                                 inputData={inputData}
//                                 isSubmitting={isSubmitting}
//                                 setFieldTouched={setFieldTouched}
//                                 setFieldValue={setFieldValue}
//                                 errors={errors}
//                                 values={values}
//                                 returnUrl={returnUrl}
//                               >
//                                 {console.log(errors)}
//                               </ScheduleClassInstructorForm>
//                             )}
//                         </Formik>
//                     )}
//                   </Mutation>
//                 </ClassEditBase>
//               )
//             }}
//           </Query>
//         </div>
//       </SiteWrapper>
//     )
//   }
// }


export default withTranslation()(withRouter(ScheduleClassPriceEdit))