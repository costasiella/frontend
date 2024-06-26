// @flow

import React, { Component } from 'react'
import { Query, Mutation } from "@apollo/client"
import { gql } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Alert,
  Page,
  Grid,
  Icon,
  Dimmer,
  Badge,
  Button,
  Card,
  Container,
  Table
} from "tabler-react";
import SiteWrapper from "../../../../SiteWrapper"
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import { TimeStringToJSDateOBJ } from '../../../../../tools/date_tools'
// import { confirmAlert } from 'react-confirm-alert'; // Import
import { toast } from 'react-toastify'
import { class_edit_all_subtitle, represent_instructor_role } from "../tools"
import confirm_delete from "../../../../../tools/confirm_delete"

import ContentCard from "../../../../general/ContentCard"
import ClassEditBase from "../ClassEditBase"

import { GET_SCHEDULE_CLASS_ACCOUNTS_QUERY } from "./queries"

const DELETE_SCHEDULE_CLASS_INSTRUCTOR = gql`
  mutation DeleteScheduleClassInstructor($input: DeleteScheduleItemAccountInput!) {
    deleteScheduleItemAccount(input: $input) {
      ok
    }
  }
`


class ScheduleClassInstructors extends Component {
  constructor(props) {
    super(props)
    console.log("Schedule classs instructors props:")
    console.log(props)
  }

  render() {
    const t = this.props.t
    const match = this.props.match
    const history = this.props.history
    const classId = match.params.class_id

    const ButtonAdd = <HasPermissionWrapper permission="add" resource="scheduleiteminstructor">
      <Link to={"/schedule/classes/all/instructors/" + classId + "/add" } >
        <Button color="primary btn-block mb-6">
        <Icon prefix="fe" name="plus-circle" /> {t('schedule.classes.instructors.add')}
        </Button>
      </Link>
    </HasPermissionWrapper>

    return (
      <SiteWrapper>
      <div className="my-3 my-md-5">
        {console.log('ID here:')}
        {console.log(classId)}
        <Query query={GET_SCHEDULE_CLASS_ACCOUNTS_QUERY} variables={{ scheduleItem: classId }}>
          {({ loading, error, data, refetch, fetchMore }) => {
  
            // Loading
            if (loading) return (
              <ClassEditBase menu_activeLink="instructors" card_title={t('schedule.classes.instructors.title')} sidebar_button={ButtonAdd}>
                <Dimmer active={true} loader={true} />
              </ClassEditBase>
            )
            // Error
            if (error) return (
              <ClassEditBase menu_activeLink="instructors" card_title={t('schedule.classes.instructors.title')} sidebar_button={ButtonAdd}>
                <p>{t('schedule.classes.instructors.error_loading')}</p>
              </ClassEditBase>
            )
            // const headerOptions = <Card.Options>
            //   <Button color={(!archived) ? 'primary': 'secondary'}  
            //           size="sm"
            //           onClick={() => {archived=false; refetch({archived});}}>
            //     {t('general.current')}
            //   </Button>
            //   <Button color={(archived) ? 'primary': 'secondary'} 
            //           size="sm" 
            //           className="ml-2" 
            //           onClick={() => {archived=true; refetch({archived});}}>
            //     {t('general.archive')}
            //   </Button>
            // </Card.Options>
  
            const initialTimeStart = TimeStringToJSDateOBJ(data.scheduleItem.timeStart)
            const subtitle = class_edit_all_subtitle({
              t: t,
              location: data.scheduleItem.organizationLocationRoom.organizationLocation.name,
              locationRoom: data.scheduleItem.organizationLocationRoom.name,
              classtype: data.scheduleItem.organizationClasstype.name,
              starttime: initialTimeStart,
              dateStart: scheduleItem.dateStart,
              frequencyType: scheduleItem.frequencyType,
              frequencyInterval: scheduleItem.frequencyInterval
            })
  
            // Empty list
            if (!data.scheduleItemAccounts.edges.length) { return (
              <ClassEditBase menu_activeLink="instructors" card_title={t('schedule.classes.instructors.title')} sidebar_button={ButtonAdd}>
                <p>{t('schedule.classes.instructors.empty_list')}</p>
              </ClassEditBase>
            )} else {   
            // Life's good! :)
              return (
                <ClassEditBase 
                  menu_activeLink="instructors" 
                  default_card={false} 
                  subtitle={subtitle}
                  sidebar_button={ButtonAdd}
                >
                <ContentCard 
                  cardTitle={t('schedule.classes.title_edit')}
                  // headerContent={headerOptions}
                  pageInfo={data.scheduleItemAccounts.pageInfo}
                  onLoadMore={() => {
                  fetchMore({
                    variables: {
                      after: data.scheduleItemAccounts.pageInfo.endCursor
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      const newEdges = fetchMoreResult.scheduleItemAccounts.edges
                      const pageInfo = fetchMoreResult.scheduleItemAccounts.pageInfo
  
                      return newEdges.length
                        ? {
                            // Put the new locations at the end of the list and update `pageInfo`
                            // so we have the new `endCursor` and `hasNextPage` values
                            data: { 
                              scheduleItemAccounts: {
                                __typename: previousResult.scheduleItemAccounts.__typename,
                                edges: [ ...previousResult.scheduleItemAccounts.edges, ...newEdges ],
                                pageInfo
                              }
                            }
                          }
                        : previousResult
                      }
                    })
                  }} >
                  <div>
                    <Table>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
                          <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
                          <Table.ColHeader>{t('general.instructor')}</Table.ColHeader>
                          <Table.ColHeader>{t('general.instructor_2')}</Table.ColHeader>
                          <Table.ColHeader></Table.ColHeader>
                          <Table.ColHeader></Table.ColHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {data.scheduleItemAccounts.edges.map(({ node }) => (
                          <Table.Row key={v4()}>
                            {console.log(node)}
                            <Table.Col key={v4()}> 
                              {moment(node.dateStart).format('LL')}
                            </Table.Col>
                            <Table.Col key={v4()}> 
                              {(node.dateEnd) ? moment(node.dateEnd).format('LL') : ""}
                            </Table.Col>
                            <Table.Col>
                              {node.account.fullName} <br />
                              <span className="text-muted">
                                {represent_instructor_role(t, node.role)}
                              </span>
                            </Table.Col>
                            <Table.Col>
                              {node.account2 ?
                                <span>
                                  {node.account2.fullName} <br />
                                  <span className="text-muted">
                                    {represent_instructor_role(t, node.role2)}
                                  </span>
                                </span> : ""
                              }
                            </Table.Col>
                            <Table.Col className="text-right" key={v4()}>
                              <Button className='btn-sm' 
                                      onClick={() => history.push("/schedule/classes/all/instructors/" + match.params.class_id + '/edit/' + node.id)}
                                      color="secondary">
                                {t('general.edit')}
                              </Button>
                            </Table.Col>
                            <Mutation mutation={DELETE_SCHEDULE_CLASS_INSTRUCTOR} key={v4()}>
                              {(deleteScheduleItemAccount, { data }) => (
                                <Table.Col className="text-right" key={v4()}>
                                  <button className="icon btn btn-link btn-sm" 
                                      title={t('general.delete')} 
                                      href=""
                                      onClick={() => {
                                        confirm_delete({
                                          t: t,
                                          msgConfirm: t('schedule.classes.instructors.delete_confirm_msg'),
                                          msgDescription: <p>{t('schedule.classes.instructors.delete_confirm_description')}</p>,
                                          msgSuccess: t('schedule.classes.instructors.deleted'),
                                          deleteFunction: deleteScheduleItemAccount,
                                          functionVariables: { variables: {
                                            input: {
                                              id: node.id
                                            }
                                          }, refetchQueries: [
                                            {query: GET_SCHEDULE_CLASS_ACCOUNTS_QUERY, variables: { scheduleItem: match.params.class_id }}
                                          ]}
                                      })}}
                                  >
                                    <span className="text-red">
                                      <Icon prefix="fe" name="trash-2" />
                                    </span>
                                  </button>
                                </Table.Col>
                              )}
                            </Mutation>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                    </div>
                  </ContentCard>
                </ClassEditBase>
            )}}
          }
        </Query>
      </div>
    </SiteWrapper>
    )
  }

};

export default withTranslation()(withRouter(ScheduleClassInstructors))