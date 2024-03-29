import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'

import {
  Dimmer,
  Table,
  Card
} from "tabler-react";

import { toast } from 'react-toastify'

import ContentCard from "../../../../general/ContentCard"
import ClassEditBack from '../ClassEditBack'
import ClassEditBase from "../ClassEditBase"
import ScheduleClassClasspassForm from "./ScheduleClassClasspassForm"

import { SCHEDULE_CLASS_CLASSPASS_SCHEMA } from './yupSchema'
import { GET_SCHEDULE_CLASS_CLASSPASSES_QUERY, UPDATE_SCHEDULE_CLASS_CLASSPASS } from "./queries"


function ScheduleClassClasspasses({ t, match }) {
  const classId = match.params.class_id
  const menuActiveLink = "classpasses"
  const cardTitle = t('schedule.classes.classpasses.title')
  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_CLASS_CLASSPASSES_QUERY, { 
    variables: { scheduleItem: classId }
  })
  const [ updateScheduleClassClasspass ] = useMutation(UPDATE_SCHEDULE_CLASS_CLASSPASS)

  const pageHeaderButtonList = <ClassEditBack />

  // Loading
  if (loading) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <Dimmer active={true} loader={true} />
      </Card.Body>
    </ClassEditBase>
  )
  // Error
  if (error) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('schedule.classes.classpasses.error_loading')}</p>
      </Card.Body>
    </ClassEditBase>
  )

  // Empty list
  if (!data.scheduleItemOrganizationClasspassGroups.edges.length) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('schedule.classes.classpasses.empty_list')}</p>
      </Card.Body>
    </ClassEditBase>
  )

  return (
    <ClassEditBase 
      defaultCard={false} 
      menuActiveLink={menuActiveLink} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
    <ContentCard 
      cardTitle={cardTitle}
      // headerContent={headerOptions}
      pageInfo={data.scheduleItemOrganizationClasspassGroups.pageInfo}
      hasCardBody={false}
      onLoadMore={() => {
      fetchMore({
        variables: {
          after: data.scheduleItemOrganizationClasspassGroups.pageInfo.endCursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.scheduleItemOrganizationClasspassGroups.edges
          const pageInfo = fetchMoreResult.scheduleItemOrganizationClasspassGroups.pageInfo

          return newEdges.length
            ? {
                // Put the new locations at the end of the list and update `pageInfo`
                // so we have the new `endCursor` and `hasNextPage` values
                data: { 
                  scheduleItemOrganizationClasspassGroups: {
                    __typename: previousResult.scheduleItemOrganizationClasspassGroups.__typename,
                    edges: [ ...previousResult.scheduleItemOrganizationClasspassGroups.edges, ...newEdges ],
                    pageInfo
                  }
                }
              }
            : previousResult
          }
        })
      }} >
      <div>
        <Table cards>
          <Table.Header>
            <Table.Row>
              <Table.ColHeader>{t('general.classpass_group')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.scheduleItemOrganizationClasspassGroups.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                {console.log(node)}
                <Table.Col key={v4()}> 
                  {node.organizationClasspassGroup.name}
                </Table.Col>
                <Table.Col>
                <Formik
                    initialValues={{  
                      shopBook: node.shopBook,
                      attend: node.attend
                    }}
                    validationSchema={SCHEDULE_CLASS_CLASSPASS_SCHEMA}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log(values)

                        updateScheduleClassClasspass({ variables: {
                            input: {
                              id: node.id,
                              shopBook: values.shopBook,
                              attend: values.attend
                            }
                          }, refetchQueries: [
                            { query: GET_SCHEDULE_CLASS_CLASSPASSES_QUERY,
                              variables: { scheduleItem: classId }
                            }],
                          // Mutation is "complete" when refetchQueries finish
                          awaitRefetchQueries: true
                        })
                        .then(({ data }) => {
                            console.log('got data', data);
                            toast.success((t('schedule.classes.classpasses.toast_edit_success')), {
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
                    {({ isSubmitting, setSubmitting, errors, values, setFieldTouched, setFieldValue, submitForm }) => (
                      <ScheduleClassClasspassForm
                        isSubmitting={isSubmitting}
                        setSubmitting={setSubmitting}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        values={values}
                        submitForm={submitForm}
                      >
                        {console.log(errors)}
                        {console.log(values)}
                        test
                      </ScheduleClassClasspassForm>
                    )}
                </Formik>
                </Table.Col>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        </div>
      </ContentCard>
    </ClassEditBase>
  )
}


// class ScheduleClassClasspasses extends Component {
//   constructor(props) {
//     super(props)
//     console.log("Schedule classs classpasses props:")
//     console.log(props)
//   }

//   render() {
//     const t = this.props.t
//     const match = this.props.match
//     const history = this.props.history
//     const classId = match.params.class_id

//     const ButtonAdd = <HasPermissionWrapper permission="add" resource="scheduleitemclasspass">
//       <Link to={"/schedule/classes/all/classpasses/" + classId + "/add" } >
//         <Button color="primary btn-block mb-6">
//         <Icon prefix="fe" name="plus-circle" /> {t('schedule.classes.classpasses.add')}
//         </Button>
//       </Link>
//     </HasPermissionWrapper>

//     return (
//       <SiteWrapper>
//       <div className="my-3 my-md-5">
//         {console.log('ID here:')}
//         {console.log(classId)}
//         <Query query={GET_SCHEDULE_CLASS_CLASSPASSES_QUERY} variables={{ scheduleItem: classId }}>
//           {({ loading, error, data, refetch, fetchMore }) => {
  
//             // Loading
//             if (loading) return (
//               <ClassEditBase menu_activeLink="classpasses" card_title={t('schedule.classes.classpasses.title')} sidebar_button={ButtonAdd}>
//                 <Dimmer active={true} loader={true} />
//               </ClassEditBase>
//             )
//             // Error
//             if (error) return (
//               <ClassEditBase menu_activeLink="classpasses" card_title={t('schedule.classes.classpasses.title')} sidebar_button={ButtonAdd}>
//                 <p>{t('schedule.classes.classpasses.error_loading')}</p>
//               </ClassEditBase>
//             )
  
//             const initialTimeStart = TimeStringToJSDateOBJ(data.scheduleItem.timeStart)
//             const subtitle = class_edit_all_subtitle({
//               t: t,
//               location: data.scheduleItem.organizationLocationRoom.organizationLocation.name,
//               locationRoom: data.scheduleItem.organizationLocationRoom.name,
//               classtype: data.scheduleItem.organizationClasstype.name,
//               starttime: initialTimeStart
//             })
  
//             // Empty list
//             if (!data.scheduleItemOrganizationClasspassGroups.edges.length) { return (
//               <ClassEditBase menu_activeLink="classpasses" card_title={t('schedule.classes.classpasses.title')} sidebar_button={ButtonAdd}>
//                 <p>{t('schedule.classes.classpasses.empty_list')}</p>
//               </ClassEditBase>
//             )} else {   
//             // Life's good! :)
//               return (
//                 <ClassEditBase 
//                   menu_activeLink="classpasses" 
//                   default_card={false} 
//                   subtitle={subtitle}
//                   sidebar_button={ButtonAdd}
//                 >
//                 <ContentCard 
//                   cardTitle={t('schedule.classes.title_edit')}
//                   // headerContent={headerOptions}
//                   pageInfo={data.scheduleItemOrganizationClasspassGroups.pageInfo}
//                   onLoadMore={() => {
//                   fetchMore({
//                     variables: {
//                       after: data.scheduleItemOrganizationClasspassGroups.pageInfo.endCursor
//                     },
//                     updateQuery: (previousResult, { fetchMoreResult }) => {
//                       const newEdges = fetchMoreResult.scheduleItemOrganizationClasspassGroups.edges
//                       const pageInfo = fetchMoreResult.scheduleItemOrganizationClasspassGroups.pageInfo
  
//                       return newEdges.length
//                         ? {
//                             // Put the new locations at the end of the list and update `pageInfo`
//                             // so we have the new `endCursor` and `hasNextPage` values
//                             data: { 
//                               scheduleItemOrganizationClasspassGroups: {
//                                 __typename: previousResult.scheduleItemOrganizationClasspassGroups.__typename,
//                                 edges: [ ...previousResult.scheduleItemOrganizationClasspassGroups.edges, ...newEdges ],
//                                 pageInfo
//                               }
//                             }
//                           }
//                         : previousResult
//                       }
//                     })
//                   }} >
//                   <div>
//                     <Table>
//                       <Table.Header>
//                         <Table.Row>
//                           <Table.ColHeader>{t('general.classpass')}</Table.ColHeader>
//                           <Table.ColHeader></Table.ColHeader>
//                         </Table.Row>
//                       </Table.Header>
//                       <Table.Body>
//                         {data.scheduleItemOrganizationClasspassGroups.edges.map(({ node }) => (
//                           <Table.Row key={v4()}>
//                             {console.log(node)}
//                             <Table.Col key={v4()}> 
//                               {node.organizationClasspassGroup.name}
//                             </Table.Col>
//                             <Table.Col>
//                             <Mutation mutation={UPDATE_SCHEDULE_CLASS_CLASSPASS}> 
//                               {(updateScheduleClassClasspass, { data }) => (
//                                 <Formik
//                                     initialValues={{  
//                                       shopBook: node.shopBook,
//                                       attend: node.attend
//                                     }}
//                                     validationSchema={SCHEDULE_CLASS_CLASSPASS_SCHEMA}
//                                     onSubmit={(values, { setSubmitting }) => {
//                                         console.log(values)

//                                         updateScheduleClassClasspass({ variables: {
//                                           input: {
//                                             id: node.id,
//                                             shopBook: values.shopBook,
//                                             attend: values.attend
//                                           }
//                                         }, refetchQueries: [
//                                             // {query: GET_SCHEDULE_CLASS_ACCOUNTS_QUERY, variables: { scheduleItem: match.params.class_id }},
//                                             // {query: GET_CLASSPASSES_QUERY, variables: {"archived": false }},
//                                         ]})
//                                         .then(({ data }) => {
//                                             console.log('got data', data);
//                                             toast.success((t('schedule.classes.classpasses.toast_edit_success')), {
//                                                 position: toast.POSITION.BOTTOM_RIGHT
//                                               })
//                                             setSubmitting(false)
//                                           }).catch((error) => {
//                                             toast.error((t('general.toast_server_error')) +  error, {
//                                                 position: toast.POSITION.BOTTOM_RIGHT
//                                               })
//                                             console.log('there was an error sending the query', error)
//                                             setSubmitting(false)
//                                           })
//                                     }}
//                                     >
//                                     {({ isSubmitting, errors, values, setFieldTouched, setFieldValue, submitForm }) => (
//                                       <ScheduleClassClasspassForm
//                                         isSubmitting={isSubmitting}
//                                         setFieldTouched={setFieldTouched}
//                                         setFieldValue={setFieldValue}
//                                         errors={errors}
//                                         values={values}
//                                         submitForm={submitForm}
//                                       >
//                                         {console.log(errors)}
//                                         {console.log(values)}
//                                         test
//                                       </ScheduleClassClasspassForm>
//                                     )}
//                                 </Formik>
//                               )}
//                             </Mutation>
//                             </Table.Col>
//                           </Table.Row>
//                         ))}
//                       </Table.Body>
//                     </Table>
//                     </div>
//                   </ContentCard>
//                 </ClassEditBase>
//             )}}
//           }
//         </Query>
//       </div>
//     </SiteWrapper>
//     )
//   }

// };

export default withTranslation()(withRouter(ScheduleClassClasspasses))