import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from "moment"

import {
  Button,
  Page,
  Grid,
  Container,
} from "tabler-react";

import { TOKEN_REFRESH } from '../../../../../queries/system/auth';
import { refreshTokenAndOpenExportLinkInNewTab } from '../../../../../tools/refresh_token_and_open_export_link';
import SiteWrapper from "../../../../SiteWrapper"
import ButtonListWeekChooser from '../../../../ui/ButtonListWeekChooser';
import ScheduleClassBack from "../ScheduleClassBack"
import ClassMenu from "../ClassMenu"

function ScheduleClassAttendanceBaseBase({ t, match, history, children, pageSubTitle, refetch=f=>f }) {
  const scheduleItemId = match.params.class_id
  const classDate = match.params.date
  const exportUrl = `/d/export/schedule_item_attendance/mailinglist/${scheduleItemId}/${classDate}`

  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)

  function onClickPrevious() {
    const previousWeek = moment(classDate).subtract(7, "days").format('YYYY-MM-DD')
    history.push(`/schedule/classes/class/attendance/${scheduleItemId}/${previousWeek}`)
  }
  function onClickNext () {
    const previousWeek = moment(classDate).add(7, "days").format('YYYY-MM-DD')
    history.push(`/schedule/classes/class/attendance/${scheduleItemId}/${previousWeek}`)
  }

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t('schedule.title')} subTitle={pageSubTitle}>
            <div className="page-options d-flex">       
              <ScheduleClassBack />
              {/* Export Mailinglist */}
              <Button
                color="secondary"
                icon="download-cloud"
                className="mr-2"
                onClick={() => refreshTokenAndOpenExportLinkInNewTab(
                  t, doTokenRefresh, history, exportUrl
                )}
              >
                {t('general.mailing_list')} 
              </Button>
              <ButtonListWeekChooser 
                showCurrent={false}
                onClickPrevious={onClickPrevious}
                onClickNext={onClickNext}
              />
            </div>
          </Page.Header>
          <Grid.Row>
              <Grid.Col xs={12} sm={12} md={9}>
                {children}
              </Grid.Col>
              <Grid.Col xs={12} sm={12} md={3}>
                <ClassMenu 
                  scheduleItemId={scheduleItemId}
                  classDate={classDate}
                  activeLink="attendance"
                />
              </Grid.Col>
            </Grid.Row>
          </Container>
      </div>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(ScheduleClassAttendanceBaseBase))
