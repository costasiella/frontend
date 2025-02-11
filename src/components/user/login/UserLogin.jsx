import React, { useContext } from 'react'
import { useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import {
  Button,
  Icon,
} from "tabler-react"

import AppSettingsContext from '../../context/AppSettingsContext'
import OrganizationContext from '../../context/OrganizationContext'

import { TOKEN_AUTH } from "../../../queries/system/auth"
import { CSAuth } from "../../../tools/authentication"
import CSLS from "../../../tools/cs_local_storage"

import UserLoginForm from "./UserLoginForm"
import CSStandaloneFormPage from "../../ui/CSStandaloneFormPage"


function UserLogin({t, match, history}) {
  const organization = useContext(OrganizationContext)
  const appSettings = useContext(AppSettingsContext)
  const accountSignupEnabled = appSettings.accountSignupEnabled

  const [ doTokenAuth ] = useMutation(TOKEN_AUTH)

  // Do an auth cleanup, so we start clean when signing in
  CSAuth.cleanup()

  return (
    <CSStandaloneFormPage urlLogo={organization.urlLogoLogin} >
      <div className="text-center text-muted mb-1">
        {organization ? organization.name : ""}
      </div>
      <Formik
        initialValues={{ 
          email: "",
          password: ""
        }}
        // validationSchema={ACCOUNT_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {
            let vars = {
              username: values.email,
              password: values.password,
            }

            doTokenAuth({ variables: vars,
              refetchQueries: [
                // // Refetch list
                // {query: GET_ACCOUNTS_QUERY, variables: get_list_query_variables()},
                // // Refresh local cached results for this account
                // {query: GET_ACCOUNT_QUERY, variables: {"id": match.params.account_id}}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                // TODO: Add link to "feature switcher" here
                const next = localStorage.getItem(CSLS.AUTH_LOGIN_NEXT) || "/user/welcome"
                CSAuth.login(data.tokenAuth)
                setTimeout(() => history.push(next), 500)
            }).catch((error) => {
              toast.error((t('general.toast_server_error')) +  error, {
                  position: toast.POSITION.BOTTOM_RIGHT
                })
              console.log(error)
              setSubmitting(false)
            })
        }}
        >
        {({ isSubmitting, errors }) => (
          <UserLoginForm
            isSubmitting={isSubmitting}
            errors={errors}
          />
        )}
      </Formik>
      {
        (accountSignupEnabled) && <React.Fragment>
          <div className="text-center">
            <h5>{t('user.register.create_account')}</h5>
            {t('user.register.create_account_msg')} <br />
            {t('user.register.create_account_msg_click_below')} <br />
          </div>
          <Button 
            block
            color="link"
            RootComponent="a"
            href={(window.location.hostname === "localhost" || window.location.hostname === "dev.costasiella.com") ? 
              "http://localhost:8000/d/accounts/signup/" :
              "/d/accounts/signup/"
            } 
          >
            {t('user.register.create_account')} <Icon name="chevron-right" />
          </Button>
        </React.Fragment>
      }
    </CSStandaloneFormPage>
  )
}


export default withTranslation()(withRouter(UserLogin))