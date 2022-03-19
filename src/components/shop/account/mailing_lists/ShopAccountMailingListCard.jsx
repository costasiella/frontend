import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  Icon,
  GalleryCard,
  Button,
  Badge,
  Dimmer
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
      {/* {(node.media.edges.length) ?
        <GalleryCard.Image 
          src={(node.media.edges.length) ? node.media.edges[0].node.urlImageThumbnailLarge: ""} 
          href={`/shop/events/${node.id}`}
        /> : "" } */}
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
      {/* <GalleryCard.Footer>                  
        <GalleryCard.Details
          fullName={<span className="">{(node.instructor) ? node.instructor.fullName: ""}</span>}
          dateString={node.organizationLocation.name}
        />
        <GalleryCard.IconGroup>
        <GalleryCard.IconItem 
          name="calendar"
          label={node.dateStart}
          right={false}
          RootComponent="span"
        />
        </GalleryCard.IconGroup>
      </GalleryCard.Footer>
      <Link to={`/shop/events/${node.id}`}>
        <GalleryCard.Footer pt={10}>
          <Button
            block
            color="link"
          >
            {t("shop.events.tell_me_more")} <Icon name="chevron-right" />
          </Button>
        </GalleryCard.Footer>
      </Link> */}
    </GalleryCard>
  )
}

export default withTranslation()(withRouter(ShopAccountMailingListCard))
