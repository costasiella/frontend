export function get_order_card_status_color(status) {
    switch(status) {
        case ("RECEIVED"): 
          return "blue"
        case ("AWAITING_PAYMENT"): 
          return "blue"
        case ("PAID"):
          return "green"
        case ("DELIVERED"):
          return "green"
        case "CANCELLED":
          return "orange"
        default:
          return ""
      }
}