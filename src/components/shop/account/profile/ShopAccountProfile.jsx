import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Dimmer,
  Grid,
} from "tabler-react";

import CSLS from '../../../../tools/cs_local_storage'
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"
import { UPDATE_PROFILE } from "./queries"
import ShopAccountProfileBase from "./ShopAccountProfileBase"
import ShopAccountProfileForm from "./ShopAccountProfileForm"
import { dateToLocalISO } from '../../../../tools/date_tools'
import { ACCOUNT_SCHEMA_MINIMAL, ACCOUNT_SCHEMA_CONTACT } from "./yupSchema"


function ShopAccountProfile({t, match, history}) {
  const { loading, error, data } = useQuery(GET_USER_PROFILE)
  const [ updateProfile ] = useMutation(UPDATE_PROFILE)
  const profileSubmitNext = localStorage.getItem(CSLS.SHOP_ACCOUNT_PROFILE_NEXT)

  if (loading) return (
    <ShopAccountProfileBase>
      <Dimmer active={true} loader={true} />
    </ShopAccountProfileBase>
  )
  if (error) return (
    <ShopAccountProfileBase>
      {t("shop.account.profile.error_loading_data")}
    </ShopAccountProfileBase>
  )

// TODO: Fetch required level or profile completeness and set correct YupSchema for it.

  const user = data.user

  let validationSchema = ACCOUNT_SCHEMA_MINIMAL
  if (user.profilePolicy === "CONTACT") {
    validationSchema = ACCOUNT_SCHEMA_CONTACT
  }

  let dateOfBirth = null
  if (user.dateOfBirth) {
    dateOfBirth = new Date(user.dateOfBirth)
  }

  return (
    <ShopAccountProfileBase accountName={user.fullName}>
      <Grid.Row>
        <Grid.Col md={12}>
          <Formik
            initialValues={{ 
              firstName: user.firstName, 
              lastName: user.lastName, 
              email: user.email,
              dateOfBirth: dateOfBirth,
              gender: user.gender,
              emergency: user.emergency,
              phone: user.phone,
              mobile: user.mobile,
              address: user.address,
              postcode: user.postcode,
              city: user.city,
              country: user.country
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                let input_vars = {
                  id: user.accountId,
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  gender: values.gender,
                  emergency: values.emergency,
                  phone: values.phone,
                  mobile: values.mobile,
                  address: values.address,
                  postcode: values.postcode,
                  city: values.city,
                  country: values.country
                }

                if (values.dateOfBirth) {
                  input_vars['dateOfBirth'] = dateToLocalISO(values.dateOfBirth)
                } 

                updateProfile({ variables: {
                  input: input_vars
                }, refetchQueries: [
                    // // Refetch list
                    // {query: GET_ACCOUNTS_QUERY, variables: get_list_query_variables()},
                    // // Refresh local cached results for this account
                    // {query: GET_ACCOUNT_QUERY, variables: {"id": match.params.account_id}}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    if (profileSubmitNext) {
                      history.push(profileSubmitNext)
                    }
                    toast.success((t('shop.account.profile.toast_edit_success')), {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                    setSubmitting(false)
                  }).catch((error) => {
                    toast.error((t('general.toast_server_error')) +  error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                    console.log('there was an error sending the query', error)
                    setSubmitting(false)
                  })
            }}
            >
            {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
              <ShopAccountProfileForm
                isSubmitting={isSubmitting}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                errors={errors}
                values={values}
                returnUrl={"/shop/account"}
              />
            )}
          </Formik>
        </Grid.Col>
      </Grid.Row>
    </ShopAccountProfileBase>
  )
}


export default withTranslation()(withRouter(ShopAccountProfile))