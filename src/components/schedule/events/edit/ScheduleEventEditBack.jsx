import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Icon,
} from "tabler-react";

import ButtonBack from '../../../ui/ButtonBack';

const ScheduleEventEditBack = ({ t }) => (
  <div className="page-options d-flex">
    <ButtonBack returnUrl="/schedule/events" />
  </div>
)

export default withTranslation()(ScheduleEventEditBack)