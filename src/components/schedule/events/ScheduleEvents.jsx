import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'


import {
  Dimmer,
  Button,
  Card,
  Icon,
  Table
} from "tabler-react";

import HasPermissionWrapper from "../../HasPermissionWrapper"
import AppSettingsContext from '../../context/AppSettingsContext'

import CSLS from "../../../tools/cs_local_storage"
import BadgeBoolean from "../../ui/BadgeBoolean"

import ContentCard from "../../general/ContentCard"
import ScheduleEventsBase from "./ScheduleEventsBase"
import ScheduleEventArchive from "./ScheduleEventArchive"

import ButtonAdd from '../../ui/ButtonAdd'
import ButtonConfirm from '../../ui/ButtonConfirm'
import ButtonEdit from '../../ui/ButtonEdit'
import { GET_SCHEDULE_EVENTS_QUERY, DUPLICATE_SCHEDULE_EVENT } from "./queries"
import { get_list_query_variables } from "./tools"


// Set some initial values for dates, if not found
if (!localStorage.getItem(CSLS.SCHEDULE_EVENTS_ARCHIVED)) {
  localStorage.setItem(CSLS.SCHEDULE_EVENTS_ARCHIVED, false) 
} 


function ScheduleEvents({t, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_SCHEDULE_EVENTS_QUERY, {
    variables: get_list_query_variables()
  })
  const [duplicateScheduleEvent] = useMutation(DUPLICATE_SCHEDULE_EVENT)

  const pageHeaderButtonList = <HasPermissionWrapper permission="add" resource="scheduleevent">
    <ButtonAdd addUrl="/schedule/events/add" />
  </HasPermissionWrapper>

  const cardHeaderContent = <Card.Options>
    <Button color={(localStorage.getItem(CSLS.SCHEDULE_EVENTS_ARCHIVED) === "false") ? 'primary': 'secondary'}  
            size="sm"
            onClick={() => {
              localStorage.setItem(CSLS.SCHEDULE_EVENTS_ARCHIVED, false)
              refetch(get_list_query_variables())
            }
    }>
      {t('general.current')}
    </Button>
    <Button color={(localStorage.getItem(CSLS.SCHEDULE_EVENTS_ARCHIVED) === "true") ? 'primary': 'secondary'} 
            size="sm" 
            className="ml-2" 
            onClick={() => {
              localStorage.setItem(CSLS.SCHEDULE_EVENTS_ARCHIVED, true)
              refetch(get_list_query_variables())
            }
    }>
      {t('general.archive')}
    </Button>
  </Card.Options>

  if (loading) {
    return (
      <ScheduleEventsBase pageHeaderButtonList={pageHeaderButtonList}>
        <ContentCard 
          cardTitle={t('schedule.events.title')}
          headerContent={cardHeaderContent}
        >
          <Dimmer active={true}
                  loader={true}>
          </Dimmer>
        </ContentCard>
      </ScheduleEventsBase>
    )
  }

  if (error) {
    return (
      <ScheduleEventsBase pageHeaderButtonList={pageHeaderButtonList}>
        <ContentCard 
          cardTitle={t('schedule.events.title')}
          headerContent={cardHeaderContent}
        >
          {t("schedule.events.error_loading_data")}
        </ContentCard>
      </ScheduleEventsBase>
    )
  }

  console.log(data)

  const scheduleEvents = data.scheduleEvents

  return (
    <ScheduleEventsBase pageHeaderButtonList={pageHeaderButtonList}>
      <ContentCard 
        cardTitle={t('schedule.events.title')}
        headerContent={cardHeaderContent}
        hasCardBody={false}
        pageInfo={scheduleEvents.pageInfo}
            onLoadMore={() => {
              fetchMore({
                variables: {
                  after: scheduleEvents.pageInfo.endCursor
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                  const newEdges = fetchMoreResult.scheduleEvents.edges
                  const pageInfo = fetchMoreResult.scheduleEvents.pageInfo

                  return newEdges.length
                    ? {
                        // Put the new subscriptions at the end of the list and update `pageInfo`
                        // so we have the new `endCursor` and `hasNextPage` values
                        scheduleEvents: {
                          __typename: previousResult.scheduleEvents.__typename,
                          edges: [ ...previousResult.scheduleEvents.edges, ...newEdges ],
                          pageInfo
                        }
                      }
                    : previousResult
                }
              })
            }} 
      >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.start')}</Table.ColHeader>
              <Table.ColHeader>{t('general.event')}</Table.ColHeader>
              <Table.ColHeader>{t('general.instructor')}</Table.ColHeader>
              <Table.ColHeader>{t('general.shop')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>  
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { scheduleEvents.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  { moment(node.dateStart).format(dateFormat) } <br /> 
                </Table.Col>
                <Table.Col>
                  <span title={ node.name }>{ node.name.trunc(36) }</span> <br />
                  <small className="text-muted">
                    { node.organizationLocation.name }
                  </small>
                </Table.Col>
                <Table.Col>
                  {
                    (node.instructor) ? node.instructor.fullName.trunc(30) : ""
                  }
                </Table.Col>
                <Table.Col>
                  <BadgeBoolean value={node.displayShop} />
                </Table.Col>
                {/* <Table.Col>
                  { node.scheduleItem.organizationLocationRoom.organizationLocation.name } <br />
                  <span className="text-muted">
                    { node.scheduleItem.organizationLocationRoom.name }
                  </span> 
                </Table.Col> */}
                <Table.Col className="text-right" key={v4()}>
                  <HasPermissionWrapper key={v4()} permission="add" resource="scheduleevent">
                    <ButtonConfirm
                      title={t("schedule.events.confirm_duplicate")}
                      msgConfirm={<p>{node.name} { moment(node.dateStart).format(dateFormat) }</p>}
                      msgSuccess={(t("schedule.events.toast_duplicate_success"))}
                      actionFunction={duplicateScheduleEvent} 
                      actionFunctionVariables={{
                        variables: {input: {id: node.id}},
                        refetchQueries: [
                          { query: GET_SCHEDULE_EVENTS_QUERY, variables: get_list_query_variables() }
                        ]
                      }}
                      buttonClass="btn-secondary"
                      buttonIcon={<Icon name="copy" />}
                      buttonText={t("general.duplicate")}
                      buttonTextColor=""
                    />
                  </HasPermissionWrapper>
                  {(node.archived) ? 
                    <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <ButtonEdit editUrl={`/schedule/events/edit/${node.id}`} />
                  }
                  <ScheduleEventArchive node={node} />
                </Table.Col>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </ScheduleEventsBase>
  )
}

export default withTranslation()(withRouter(ScheduleEvents))


// const ScheduleEvents = ({ t, history, archived=false }) => (
//   <SiteWrapper>
//     <div className="my-3 my-md-5">
//       <Container>
//         <Page.Header title={t("organization.title")} />
//         <Grid.Row>
//           <Grid.Col md={9}>
//             <Query query={GET_LEVELS_QUERY} variables={{ archived }}>
//              {({ loading, error, data: {organizationLevels: levels}, refetch, fetchMore }) => {
//                 // Loading
//                 if (loading) return (
//                   <ContentCard cardTitle={t('organization.levels.title')}>
//                     <Dimmer active={true}
//                             loader={true}>
//                     </Dimmer>
//                   </ContentCard>
//                 )
//                 // Error
//                 if (error) return (
//                   <ContentCard cardTitle={t('organization.levels.title')}>
//                     <p>{t('organization.levels.error_loading')}</p>
//                   </ContentCard>
//                 )
//                 const headerOptions = <Card.Options>
//                   <Button color={(!archived) ? 'primary': 'secondary'}  
//                           size="sm"
//                           onClick={() => {archived=false; refetch({archived});}}>
//                     {t('general.current')}
//                   </Button>
//                   <Button color={(archived) ? 'primary': 'secondary'} 
//                           size="sm" 
//                           className="ml-2" 
//                           onClick={() => {archived=true; refetch({archived});}}>
//                     {t('general.archive')}
//                   </Button>
//                 </Card.Options>
                
//                 // Empty list
//                 if (!levels.edges.length) { return (
//                   <ContentCard cardTitle={t('organization.levels.title')}
//                                headerContent={headerOptions}>
//                     <p>
//                     {(!archived) ? t('organization.levels.empty_list') : t("organization.levels.empty_archive")}
//                     </p>
                   
//                   </ContentCard>
//                 )} else {   
//                 // Life's good! :)
//                 return (
//                   <ContentCard cardTitle={t('organization.levels.title')}
//                                headerContent={headerOptions}
//                                pageInfo={levels.pageInfo}
//                                onLoadMore={() => {
//                                 fetchMore({
//                                   variables: {
//                                     after: levels.pageInfo.endCursor
//                                   },
//                                   updateQuery: (previousResult, { fetchMoreResult }) => {
//                                     const newEdges = fetchMoreResult.organizationLevels.edges
//                                     const pageInfo = fetchMoreResult.organizationLevels.pageInfo

//                                     return newEdges.length
//                                       ? {
//                                           // Put the new levels at the end of the list and update `pageInfo`
//                                           // so we have the new `endCursor` and `hasNextPage` values
//                                           organizationLevels: {
//                                             __typename: previousResult.organizationLevels.__typename,
//                                             edges: [ ...previousResult.organizationLevels.edges, ...newEdges ],
//                                             pageInfo
//                                           }
//                                         }
//                                       : previousResult
//                                   }
//                                 })
//                               }} >
//                     <Table>
//                           <Table.Header>
//                             <Table.Row key={v4()}>
//                               <Table.ColHeader>{t('general.name')}</Table.ColHeader>
//                             </Table.Row>
//                           </Table.Header>
//                           <Table.Body>
//                               {levels.edges.map(({ node }) => (
//                                 <Table.Row key={v4()}>
//                                   <Table.Col key={v4()}>
//                                     {node.name}
//                                   </Table.Col>
//                                   <Table.Col className="text-right" key={v4()}>
//                                     {(node.archived) ? 
//                                       <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
//                                       <Button className='btn-sm' 
//                                               onClick={() => history.push("/organization/levels/edit/" + node.id)}
//                                               color="secondary">
//                                         {t('general.edit')}
//                                       </Button>
//                                     }
//                                   </Table.Col>
//                                   <Mutation mutation={ARCHIVE_LEVEL} key={v4()}>
//                                     {(archiveCostcenter, { data }) => (
//                                       <Table.Col className="text-right" key={v4()}>
//                                         <button className="icon btn btn-link btn-sm" 
//                                            title={t('general.archive')} 
//                                            href=""
//                                            onClick={() => {
//                                              console.log("clicked archived")
//                                              let id = node.id
//                                              archiveCostcenter({ variables: {
//                                                input: {
//                                                 id,
//                                                 archived: !archived
//                                                }
//                                         }, refetchQueries: [
//                                             {query: GET_LEVELS_QUERY, variables: {"archived": archived }}
//                                         ]}).then(({ data }) => {
//                                           console.log('got data', data);
//                                           toast.success(
//                                             (archived) ? t('general.unarchived'): t('general.archived'), {
//                                               position: toast.POSITION.BOTTOM_RIGHT
//                                             })
//                                         }).catch((error) => {
//                                           toast.error((t('general.toast_server_error')) +  error, {
//                                               position: toast.POSITION.BOTTOM_RIGHT
//                                             })
//                                           console.log('there was an error sending the query', error);
//                                         })
//                                         }}>
//                                           <Icon prefix="fa" name="inbox" />
//                                         </button>
//                                       </Table.Col>
//                                     )}
//                                   </Mutation>
//                                 </Table.Row>
//                               ))}
//                           </Table.Body>
//                         </Table>
//                   </ContentCard>
//                 )}}
//              }
//             </Query>
//           </Grid.Col>
//           <Grid.Col md={3}>
//             <HasPermissionWrapper permission="add"
//                                   resource="organizationlevel">
//               <Button color="primary btn-block mb-6"
//                       onClick={() => history.push("/organization/levels/add")}>
//                 <Icon prefix="fe" name="plus-circle" /> {t('organization.levels.add')}
//               </Button>
//             </HasPermissionWrapper>
//           </Grid.Col>
//         </Grid.Row>
//       </Container>
//     </div>
//   </SiteWrapper>
// );

