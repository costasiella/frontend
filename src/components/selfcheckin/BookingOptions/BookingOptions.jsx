// @flow

import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Grid,
} from "tabler-react";
import SelfCheckinBase from "../SelfCheckinBase"
// import HasPermissionWrapper from "../../../HasPermissionWrapper"
import { TimeStringToJSDateOBJ } from '../../../tools/date_tools'
import { toast } from 'react-toastify'

import AppSettingsContext from '../../context/AppSettingsContext'

import { get_accounts_query_variables } from "../../schedule/classes/class/tools"
import { getSubtitle } from "../Checkin/tools"

import ScheduleClassBookClasspasses from "../../schedule/classes/class/book/ScheduleClassBookClasspasses"
import CSLS from "../../../tools/cs_local_storage"
import ScheduleClassBookSubscriptions from "../../schedule/classes/class/book/ScheduleClassBookSubscriptions"
import ScheduleClassBookPriceDropin from "../../schedule/classes/class/book/ScheduleClassBookPriceDropin"
import ScheduleClassBookPriceTrial from "../../schedule/classes/class/book/ScheduleClassBookPriceTrial"

import { GET_BOOKING_OPTIONS_QUERY } from "./queries"


function SelfCheckinBookingOptions({ t, match, history }) {
  const [showSearch, setShowSearch] = useState(false)
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  const dateTimeFormat = dateFormat + " " + timeFormat

  const return_url = "/schedule/classes/"
  const account_id = match.params.account_id
  const schedule_item_id = match.params.class_id
  const class_date = match.params.date
  const locationId = match.params.location_id
  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(
    GET_BOOKING_OPTIONS_QUERY, {
      variables: {
        account: account_id,
        scheduleItem: schedule_item_id,
        date: class_date,
        listType: "ATTEND"
      }
    }
  )

  // Remove search in checkin component
  localStorage.removeItem(CSLS.SELFCHECKIN_CHECKIN_SEARCH)

  // Query
  // Loading
  if (queryLoading) return <p>{t('general.loading_with_dots')}</p>
  // Error
  if (queryError) {
    console.log(queryError)
    return <p>{t('general.error_sad_smiley')}</p>
  }
  
  console.log(queryData)
  const account = queryData.scheduleClassBookingOptions.account
  const classpasses = queryData.scheduleClassBookingOptions.classpasses
  const subscriptions = queryData.scheduleClassBookingOptions.subscriptions
  const prices = queryData.scheduleClassBookingOptions.scheduleItemPrices
  const scheduleItem = queryData.scheduleClassBookingOptions.scheduleItem
  console.log(prices)
  
  const subTitle = getSubtitle(
    class_date,
    scheduleItem,
    dateTimeFormat
  )
  
  return (
    <SelfCheckinBase title={t("selfcheckin.classes.title")} subTitle={subTitle}>
      <Grid.Row>
          <Grid.Col md={12}>
            <h4>{t('general.booking_options')} {account.fullName}</h4>
            <div className="mt-6">
            <Grid.Row cards deck>
              <ScheduleClassBookSubscriptions 
                subscriptions={subscriptions} 
                returnTo="selfcheckin" 
                locationId={locationId}
              />
              <ScheduleClassBookClasspasses 
                classpasses={classpasses} 
                returnTo="selfcheckin" 
                locationId={locationId}
              />
              {(prices) ?
                (prices.organizationClasspassDropin) ? 
                  <ScheduleClassBookPriceDropin 
                    priceDropin={prices.organizationClasspassDropin}
                    returnTo="selfcheckin" 
                    locationId={locationId}
                  /> : "" 
                : "" }
              {(prices) ?
                (prices.organizationClasspassTrial) ? 
                  <ScheduleClassBookPriceTrial 
                    priceTrial={prices.organizationClasspassTrial}
                    returnTo="selfcheckin" 
                    locationId={locationId}
                  /> : "" 
                : "" }
            </Grid.Row>
            </div>
          </Grid.Col>
        </Grid.Row>
    </SelfCheckinBase>
  )
}


export default withTranslation()(withRouter(SelfCheckinBookingOptions))

