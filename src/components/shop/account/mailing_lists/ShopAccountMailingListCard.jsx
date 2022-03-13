import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Icon,
  GalleryCard,
  Button
} from "tabler-react";

// Example:
// https://github.com/tabler/tabler-react/blob/master/example/src/interface/PricingCardsPage.react.js


function ShopAccountMailingListCard({ t, mailingList, btnLink, active=false }) {
  // classpass should be an object with at least the following values from an organizationClasspass object:
  // id, name, priceDisplay, unlimited, classes, validity, link
  return (
    <GalleryCard>
      {/* {(node.media.edges.length) ?
        <GalleryCard.Image 
          src={(node.media.edges.length) ? node.media.edges[0].node.urlImageThumbnailLarge: ""} 
          href={`/shop/events/${node.id}`}
        /> : "" } */}
      <GalleryCard.Details>
        <h4>{mailingList.name}</h4>
        <h6>{mailingList.frequency}</h6>
        <div dangerouslySetInnerHTML={{ __html: mailingList.description}} />

        <Button
          color="success" 
          block
          outline
        >
          Subscribed
        </Button>
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


    // <PricingCard active={active}>
    //   <PricingCard.Category>
    //     {mailingList.name}
    //   </PricingCard.Category>
    //   {/* <PricingCard.Price>
    //     {classpass.priceDisplay}
    //   </PricingCard.Price> */}
    //   <PricingCard.AttributeList>
    //     <PricingCard.AttributeItem>
    //       {mailingList.frequency}
    //     </PricingCard.AttributeItem>
    //     <PricingCard.AttributeItem>
    //       <div dangerouslySetInnerHTML={{ __html: mailingList.description}} />
    //     </PricingCard.AttributeItem>
    //   </PricingCard.AttributeList>
    //   {/* {(btnLink) ?
    //     <Link to={btnLink}>
    //       <PricingCard.Button >
    //         {t("shop.classpasses.choose")} <Icon name="chevron-right" />
    //       </PricingCard.Button>
    //     </Link>
    //     : ""
    //   } */}
    // </PricingCard>
  )
}

export default withTranslation()(withRouter(ShopAccountMailingListCard))
