import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { toast } from 'react-toastify'

import {
  GalleryCard,
  Button,
  Badge,
} from "tabler-react";

import { QUERY_SYSTEM_MAILCHIMP_LISTS, UPDATE_MAILCHIMP_LIST_SUBSCRIPTION_STATUS } from './queries'

// Example:
// https://github.com/tabler/tabler-react/blob/master/example/src/interface/PricingCardsPage.react.js


function ShopAccountMailingListCard({ t, mailingList, btnLink, active=false }) {
  let [isSubmitting, setSubmitting] = useState(false)
  const [ updateSubscriptionStatus ] = useMutation(UPDATE_MAILCHIMP_LIST_SUBSCRIPTION_STATUS)

  function doUpdateSubscriptionStatus(mailchimpListId) {
    setSubmitting(true)

    updateSubscriptionStatus({ variables: {
      input: {
        mailchimpListId: mailchimpListId
      }
    }, refetchQueries: [
      {query: QUERY_SYSTEM_MAILCHIMP_LISTS}
    ]})
    .then(({ data }) => {
        console.log('got data', data)
        toast.success((t('shop.account.mailing_lists.toast_update_subscription_status_success')), {
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
    }  

  return (
    <GalleryCard>
      <GalleryCard.Details>
        <div>
        <span className='float-right'>
        {(mailingList.subscribed) ? <Badge color="success">Subscribed</Badge> : ""}
        </span>
        <h4>{mailingList.name}</h4>
        </div>
        
        <h6>{mailingList.frequency}</h6>
        <div dangerouslySetInnerHTML={{ __html: mailingList.description}} />

        {(mailingList.subscribed) ? 
              <Button
                color="secondary" 
                block
                outline
                disabled={isSubmitting}
                onClick={() => doUpdateSubscriptionStatus(mailingList.mailchimpListId)}
              >
                { (isSubmitting) ? 
                  t("shop.account.mailing_lists.unsubscribing") : 
                  t("shop.account.mailing_lists.unsubscribe") 
                }
              </Button> :
              <Button
                color="success" 
                block
                outline
                disabled={isSubmitting}
                onClick={() => doUpdateSubscriptionStatus(mailingList.mailchimpListId)}
              >
                { (isSubmitting) ? 
                  t("shop.account.mailing_lists.subscribing") : 
                  t("shop.account.mailing_lists.subscribe") 
                }
              </Button>
        }
      </GalleryCard.Details>
    </GalleryCard>
  )
}

export default withTranslation()(withRouter(ShopAccountMailingListCard))
