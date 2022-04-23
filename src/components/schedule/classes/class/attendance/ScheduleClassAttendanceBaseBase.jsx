import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Button,
  Page,
  Grid,
  Container,
} from "tabler-react";

import { TOKEN_REFRESH } from '../../../../../queries/system/auth';
import { refreshTokenAndOpenExportLinkInNewTab } from '../../../../../tools/refresh_token_and_open_export_link';
import SiteWrapper from "../../../../SiteWrapper"
import ScheduleClassBack from "../ScheduleClassBack"
import ClassMenu from "../ClassMenu"

function ScheduleClassAttendanceBaseBase({ t, match, history, children, pageSubTitle }) {
  const scheduleItemId = match.params.class_id
  const classDate = match.params.date
  const exportUrl = `/d/export/schedule_item_attendance/mailinglist/${scheduleItemId}/${classDate}`

  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)

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
            </div>
          </Page.Header>
          <Grid.Row>
              <Grid.Col md={9}>
                {children}
              </Grid.Col>
              <Grid.Col md={3}>
                <ClassMenu 
                  scheduleItemId={scheduleItemId}
                  class_date={classDate}
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
