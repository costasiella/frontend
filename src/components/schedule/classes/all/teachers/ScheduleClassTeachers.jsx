// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Icon,
  Dimmer,
  Button,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import { represent_teacher_role } from "../tools"
import confirm_delete from "../../../../../tools/confirm_delete"

import ContentCard from "../../../../general/ContentCard"
import ClassEditBase from "../ClassEditBase"

import { GET_SCHEDULE_CLASS_TEACHERS_QUERY, DELETE_SCHEDULE_CLASS_TEACHER } from "./queries"


function ScheduleClassTeachers({ t, match, history}) {
  const classId = match.params.class_id
  const menuActiveLink = "teachers"
  const cardTitle = t('schedule.classes.teachers.title')
  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_CLASS_TEACHERS_QUERY, {
    variables: {scheduleItem: classId}
  })
  const [ deleteScheduleItemTeacher ] = useMutation(DELETE_SCHEDULE_CLASS_TEACHER)

  const ButtonAdd = <HasPermissionWrapper permission="add" resource="scheduleitemteacher">
    <Link to={`/schedule/classes/all/teachers/${classId}/add` } >
      <Button color="primary btn-block mb-6">
      <Icon prefix="fe" name="plus-circle" /> {t('schedule.classes.teachers.add')}
      </Button>
    </Link>
  </HasPermissionWrapper>

  // Loading
  if (loading) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={ButtonAdd}
    >
      <Dimmer active={true} loader={true} />
    </ClassEditBase>
  )
  // Error
  if (error) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={ButtonAdd}
    >
      <p>{t('schedule.classes.teachers.error_loading')}</p>
    </ClassEditBase>
  )

  // Empty list
  if (!data.scheduleItemTeachers.edges.length) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={ButtonAdd}
    >
      <p>{t('schedule.classes.teachers.empty_list')}</p>
    </ClassEditBase>
  )

  return (
    <ClassEditBase 
    menuActiveLink={menuActiveLink} 
    defaultCard={false}
    sidebarButton={ButtonAdd}
    >
      <ContentCard 
        cardTitle={cardTitle}
        pageInfo={data.scheduleItemTeachers.pageInfo}
        onLoadMore={() => {
        fetchMore({
          variables: {
            after: data.scheduleItemTeachers.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.scheduleItemTeachers.edges
            const pageInfo = fetchMoreResult.scheduleItemTeachers.pageInfo

            return newEdges.length
              ? {
                  // Put the new locations at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  data: { 
                    scheduleItemTeachers: {
                      __typename: previousResult.scheduleItemTeachers.__typename,
                      edges: [ ...previousResult.scheduleItemTeachers.edges, ...newEdges ],
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
                <Table.ColHeader>{t('general.teacher')}</Table.ColHeader>
                <Table.ColHeader>{t('general.teacher_2')}</Table.ColHeader>
                <Table.ColHeader></Table.ColHeader>
                <Table.ColHeader></Table.ColHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.scheduleItemTeachers.edges.map(({ node }) => (
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
                      {represent_teacher_role(t, node.role)}
                    </span>
                  </Table.Col>
                  <Table.Col>
                    {node.account2 ?
                      <span>
                        {node.account2.fullName} <br />
                        <span className="text-muted">
                          {represent_teacher_role(t, node.role2)}
                        </span>
                      </span> : ""
                    }
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <Link to={`/schedule/classes/all/teachers/${classId}/edit/${node.id}`}>
                      <Button className='btn-sm' 
                              color="secondary"
                      >
                        {t('general.edit')}
                      </Button>
                    </Link>
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <button className="icon btn btn-link btn-sm" 
                        title={t('general.delete')} 
                        href=""
                        onClick={() => {
                          confirm_delete({
                            t: t,
                            msgConfirm: t('schedule.classes.teachers.delete_confirm_msg'),
                            msgDescription: <p>{t('schedule.classes.teachers.delete_confirm_description')}</p>,
                            msgSuccess: t('schedule.classes.teachers.deleted'),
                            deleteFunction: deleteScheduleItemTeacher,
                            functionVariables: { variables: {
                              input: {
                                id: node.id
                              }
                            }, refetchQueries: [
                              {query: GET_SCHEDULE_CLASS_TEACHERS_QUERY, variables: { scheduleItem: match.params.class_id }}
                            ]}
                        })}}
                    >
                      <span className="text-red">
                        <Icon prefix="fe" name="trash-2" />
                      </span>
                    </button>
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


export default withTranslation()(withRouter(ScheduleClassTeachers))