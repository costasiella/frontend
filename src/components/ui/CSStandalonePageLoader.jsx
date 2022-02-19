import React from 'react'
import { withTranslation } from 'react-i18next'
import {
  Dimmer
} from "tabler-react"

import CSStandalonePageWide from './CSStandalonePageWide'


function CSStandalonePageLoader() {
  return (
    <CSStandalonePageWide>
      <div className='text-center'>
        <Dimmer active={true} loader={true} />
      </div>
    </CSStandalonePageWide>
  )
}

export default withTranslation()(CSStandalonePageLoader)



