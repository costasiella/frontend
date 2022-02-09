import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { ARCHIVE_SCHEDULE_EVENT, GET_SCHEDULE_EVENTS_QUERY } from "./queries"
import { get_list_query_variables } from './tools'

import ButtonArchive from '../../ui/ButtonArchive'
import ButtonUnArchive from '../../ui/ButtonUnArchive'


function ScheduleEventArchive({t, match, history, node}) {
  const [archiveScheduleEvent] = useMutation(ARCHIVE_SCHEDULE_EVENT)
  const refetchQueries = [
    { query: GET_SCHEDULE_EVENTS_QUERY, variables: get_list_query_variables() },
  ]

  if (!node.archived) {
    return (
      <ButtonArchive
        msgConfirm={t("schedule.events.archive_confirm_msg")}
        msgSuccess={t("general.archived")}
        archiveFunction={archiveScheduleEvent}
        archiveFunctionVariables={{ 
            variables: {
              input: {
                id: node.id,
                archived: true
              },
            }, 
            refetchQueries: refetchQueries,
          }
        }
      />
    )

  } else {
    return (
      <ButtonUnArchive
        msgConfirm={t("schedule.events.unarchive_confirm_msg")}
        msgSuccess={t("general.unarchived")}
        unArchiveFunction={archiveScheduleEvent}
        unArchiveFunctionVariables={{ 
            variables: {
              input: {
                id: node.id,
                archived: false
              },
            }, 
            refetchQueries: refetchQueries,
          }
        }
      />
    )
  }
}

export default withTranslation()(withRouter(ScheduleEventArchive))