//lib/shopify/queries/product.ts
import productFragment from '../fragments/product';

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductsByTagQuery = `
  query GetProductsByTag($tag: String!) {
    products(first: 250, query: $tag) {
      edges {
        node {
          id
          title
          handle
          availableForSale
          description
          descriptionHtml
          options {
            id
            name
            values
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                availableForSale
                selectedOptions {
                  name
                  value
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          images(first: 20) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          seo {
            title
            description
          }
          tags
          updatedAt
        }
      }
    }
  }
`;













// //lib/shopify/queries/product.ts
// import productFragment from '../fragments/product';

// export const getProductQuery = /* GraphQL */ `
//   query getProduct($handle: String!) {
//     product(handle: $handle) {
//       ...product
//       variants(first: 250) {
//         edges {
//           node {
//             id
//             merchandiseId
//             title
//             availableForSale
//             selectedOptions {
//               name
//               value
//             }
//             price {
//               amount
//               currencyCode
//             }
//           }
//         }
//       }
//     }
//   }
//   ${productFragment}
// `;

// export const getProductsQuery = /* GraphQL */ `
//   query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
//     products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
//       edges {
//         node {
//           ...product
//         }
//       }
//     }
//   }
//   ${productFragment}
// `;

// export const getProductRecommendationsQuery = /* GraphQL */ `
//   query getProductRecommendations($productId: ID!) {
//     productRecommendations(productId: $productId) {
//       ...product
//     }
//   }
//   ${productFragment}
// `;

// export const getProductsByTagQuery = `
//   query GetProductsByTag($tag: String!) {
//     products(first: 250, query: $tag) {
//       edges {
//         node {
//           id
//           title
//           handle
//           availableForSale
//           description
//           descriptionHtml
//           options {
//             id
//             name
//             values
//           }
//           priceRange {
//             minVariantPrice {
//               amount
//               currencyCode
//             }
//           }
//           variants(first: 250) {
//             edges {
//               node {
//                 id
//                 title
//                 availableForSale
//                 selectedOptions {
//                   name
//                   value
//                 }
//                 price {
//                   amount
//                   currencyCode
//                 }
//               }
//             }
//           }
//           featuredImage {
//             url
//             altText
//             width
//             height
//           }
//           images(first: 20) {
//             edges {
//               node {
//                 url
//                 altText
//                 width
//                 height
//               }
//             }
//           }
//           seo {
//             title
//             description
//           }
//           tags
//           updatedAt
//         }
//       }
//     }
//   }
// `;

// // Add helper function for product data validation
// export const validateProductResponse = (response: any) => {
//   console.log('Raw product response:', response);
  
//   const variants = response?.data?.product?.variants?.edges;
//   if (!variants?.length) {
//     console.error('No variants found in product data:', response);
//     return false;
//   }

//   const firstVariant = variants[0].node;
//   if (!firstVariant?.merchandiseId) {
//     console.error('Missing merchandiseId in variant data:', firstVariant);
//     return false;
//   }

//   console.log('Valid product data with merchandiseId:', firstVariant.merchandiseId);
//   return true;
// };
