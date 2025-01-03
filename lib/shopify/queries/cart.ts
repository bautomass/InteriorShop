//lib/shopify/queries/cart.ts
import { cartFragment } from '../fragments/cart';

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

// Add a query to get cart with checkout URL validation
export const getCartWithCheckoutQuery = /* GraphQL */ `
  query getCartWithCheckout($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
      checkoutUrl
      ready
      paymentSettings {
        enabledPresentmentCurrencies
      }
    }
  }
  ${cartFragment}
`;








// //lib/shopify/queries/cart.ts
// import { cartFragment } from '../fragments/cart';

// export const getCartQuery = /* GraphQL */ `
//   query getCart($cartId: ID!) {
//     cart(id: $cartId) {
//       ...cart
//     }
//   }
//   ${cartFragment}
// `;