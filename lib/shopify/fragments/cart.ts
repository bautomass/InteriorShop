//lib/shopify/fragments/cart.ts
import productFragment from './product';

export const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    buyerIdentity {
      email
      phone
      countryCode
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                ...product
              }
            }
          }
          attributes {
            key
            value
          }
        }
      }
    }
    totalQuantity
    note
    attributes {
      key
      value
    }
  }
  ${productFragment}
`;













// //lib/shopify/fragments/cart.ts
// import productFragment from './product';

// export const cartFragment = /* GraphQL */ `
//   fragment cart on Cart {
//     id
//     checkoutUrl
//     cost {
//       subtotalAmount {
//         amount
//         currencyCode
//       }
//       totalAmount {
//         amount
//         currencyCode
//       }
//       totalTaxAmount {
//         amount
//         currencyCode
//       }
//     }
//     lines(first: 100) {
//       edges {
//         node {
//           id
//           quantity
//           cost {
//             totalAmount {
//               amount
//               currencyCode
//             }
//           }
//           merchandise {
//             ... on ProductVariant {
//               id
//               title
//               selectedOptions {
//                 name
//                 value
//               }
//               product {
//                 ...product
//               }
//             }
//           }
//         }
//       }
//     }
//     totalQuantity
//   }
//   ${productFragment}
// `;