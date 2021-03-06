import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import AppSettingsContext from '../../context/AppSettingsContext'

import {
  Badge,
  Dropdown,
  Card,
  Table,
} from "tabler-react";

import HasPermissionWrapper from "../../HasPermissionWrapper"
import confirm_delete from "../../../tools/confirm_delete"
import CSLS from "../../../tools/cs_local_storage"

import ScheduleShiftsBase from './ScheduleShiftsBase'

import { GET_SHIFTS_QUERY, DELETE_SCHEDULE_SHIFT } from "./queries"
import { 
  get_class_messages,
  get_list_query_variables, 
  represent_shift_status
} from './tools'

import moment from 'moment'


// Set some initial values for dates, if not found
if (!localStorage.getItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM)) {
  console.log('date from not found... defaulting to today...')
  localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM, moment().format('YYYY-MM-DD')) 
  localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL, moment().add(6, 'days').format('YYYY-MM-DD')) 
} 


function ScheduleShifts ({ t, history }) {
  const appSettings = useContext(AppSettingsContext)
  const timeFormat = appSettings.timeFormatMoment

  const {loading, error, data, refetch} = useQuery(GET_SHIFTS_QUERY, {
    variables: get_list_query_variables(),
    fetchPolicy: "network-only"
  })
  const [deleteScheduleShift] = useMutation(DELETE_SCHEDULE_SHIFT)

  if (loading) {
    return (
      <ScheduleShiftsBase>
        <p>{t('general.loading_with_dots')}</p>
      </ScheduleShiftsBase>
    )
  }

  if (error) {
    return (
      <ScheduleShiftsBase>
        <p>{t('general.error_sad_smiley')}</p>
      </ScheduleShiftsBase>
    )
  }

  const shifts = data.scheduleShifts
  console.log(shifts)
       
  // Empty list
  if (!shifts.length) { return (
    <ScheduleShiftsBase>
      <p>
        {t('schedule.shifts.empty_list')}
      </p>
    </ScheduleShiftsBase>
  )} 

  return (
    <ScheduleShiftsBase data={data} refetch={refetch}>
      { data.scheduleShifts.map(({ date, shifts }) => (
        <div key={v4()}>
          <Card>
            <Card.Header>
              <Card.Title>
                <b>{moment(date).format("dddd")}</b> {' '}
                <span className="text-muted">
                  {moment(date).format("LL")} 
                </span>
              </Card.Title>
            </Card.Header>
            {!(shifts.length) ? <Card.Body>{t('schedule.shifts.empty_list')}</Card.Body> :
              <Table cards>
                <Table.Header>
                  <Table.Row key={v4()}>
                    <Table.ColHeader /> 
                    <Table.ColHeader>{t('general.time')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.location')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.shift')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.employee')}</Table.ColHeader>
                    <Table.ColHeader></Table.ColHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {shifts.map((
                    { scheduleItemId, 
                      frequencyType,
                      date, 
                      status,
                      holiday,
                      holidayName,
                      description,
                      account, 
                      account2,
                      organizationLocationRoom, 
                      organizationShift, 
                      timeStart, 
                      timeEnd }) => (
                    <Table.Row key={v4()}>
                      <Table.Col>
                        {represent_shift_status(status)}
                      </Table.Col>
                      <Table.Col>
                        {/* Start & end time */}
                        {moment(date + ' ' + timeStart).format(timeFormat)} {' - '}
                        {moment(date + ' ' + timeEnd).format(timeFormat)} { ' ' }
                        {(frequencyType === 'SPECIFIC') ? <Badge color="primary">{t('general.once')}</Badge> : null } <br />
                        <small className="text-muted">{get_class_messages(t, status, description, holiday, holidayName)}</small>
                      </Table.Col>
                      <Table.Col>
                        {/* Location */}
                        {organizationLocationRoom.organizationLocation.name} <br />
                        <small className="text-muted">{organizationLocationRoom.name}</small>
                      </Table.Col>
                      <Table.Col>
                        {/* Shift and level */}
                        {organizationShift.name}
                      </Table.Col>
                      <Table.Col>
                        {/* Employee(s) */}
                        { (account) ? 
                            account.fullName : 
                            <span className="text-red">{t("schedule.shifts.no_employee")}</span>
                        } <br />
                        <small className="text-muted">
                          {(account2) ? account2.fullName : ""}
                        </small>
                      </Table.Col>
                      <Table.Col>
                        <Dropdown
                          key={v4()}
                          className="pull-right"
                          type="button"
                          toggle
                          color="secondary btn-sm"
                          triggerContent={t("general.actions")}
                          items={[
                            <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemweeklyotc">
                              <Link to={'/schedule/shifts/shift/edit/' + scheduleItemId + '/' + date}>
                                <Dropdown.Item
                                  key={v4()}
                                  icon="edit-3"
                                >
                                  {t("general.edit")}
                                </Dropdown.Item>
                              </Link>
                            </HasPermissionWrapper>,
                            <HasPermissionWrapper key={v4()} permission="change" resource="scheduleshift">
                              <Dropdown.ItemDivider key={v4()} />
                              <Link to={'/schedule/shifts/all/edit/' + scheduleItemId}>
                                <Dropdown.Item
                                  key={v4()}
                                  badge={t('schedule.shifts.all_shifts_in_series')}
                                  badgeType="secondary"
                                  icon="edit-3"
                                >
                                    {t("general.edit")}
                                </Dropdown.Item>
                              </Link>
                            </HasPermissionWrapper>,
                            <HasPermissionWrapper key={v4()} permission="delete" resource="scheduleshift">
                              <Dropdown.ItemDivider key={v4()} />
                              <span className="text-red">
                              <Dropdown.Item
                                key={v4()}
                                badge={t('schedule.shifts.all_shifts_in_series')}
                                badgeType="danger"
                                icon="trash-2"
                                onClick={() => {
                                  confirm_delete({
                                    t: t,
                                    msgConfirm: t("schedule.shifts.delete_confirm_msg"),
                                    msgDescription: <p key={v4()}>
                                      {moment(date + ' ' + timeStart).format(timeFormat)} {' - '}
                                      {moment(date + ' ' + timeEnd).format(timeFormat)} {' '} 
                                      {organizationShift.name} {' '} @ {' '}
                                      {organizationLocationRoom.organizationLocation.name} {' '}
                                      {organizationLocationRoom.name}
                                      </p>,
                                    msgSuccess: t('schedule.shifts.deleted'),
                                    deleteFunction: deleteScheduleShift,
                                    functionVariables: { variables: {
                                      input: {
                                        id: scheduleItemId
                                      }
                                    }, refetchQueries: [
                                      { query: GET_SHIFTS_QUERY, variables: get_list_query_variables() }
                                    ]}
                                  })
                                }}>
                              {t("general.delete")}
                              </Dropdown.Item>
                              </span>
                            </HasPermissionWrapper>
                          ]}
                        />
                      </Table.Col>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            }
          </Card>
        </div>
      ))}
    </ScheduleShiftsBase>
  )
}

export default withTranslation()(withRouter(ScheduleShifts))
