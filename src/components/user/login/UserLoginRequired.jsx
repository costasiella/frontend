import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { ToastContainer, Slide} from 'react-toastify'
import {
  Card,
  Button,
  Icon,
} from "tabler-react"

import CSStandaloneFormPage from "../../ui/CSStandaloneFormPage"


function UserLoginRequired({t, match, history}) {
  const [active, setActive] = useState(false);

  return (
    <CSStandaloneFormPage>
      {/* TODO: point imageURL to logo */}
      <Card>
        <Card.Body>
          <Card.Title>
            {t('user.login_required.title')}
          </Card.Title>
          {t('user.login_required.message')} <br /><br />
          <Button 
            block
            loading={active}
            disabled={active}
            color="primary"
            type="button" 
            onClick={() => {
              setActive(true)
              setTimeout(() => history.push('/user/login'), 250)
            }}
          >
            {t('user.login_required.go_to_login')} <Icon name="chevron-right" />
          </Button>
        </Card.Body>
      </Card>
      <ToastContainer 
          autoClose={5000} 
          transition={Slide}
      />
    </CSStandaloneFormPage>
  )
}

export default withTranslation()(withRouter(UserLoginRequired))