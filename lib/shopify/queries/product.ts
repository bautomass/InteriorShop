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
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 250) {
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
  query GetProductsByTag($query: String!) {
    products(first: 250, query: $query) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;


export const getProductsByCollectionQuery = /* GraphQL */ `
  query getProductsByCollection($collection: String!, $first: Int!, $after: String) {
    collection(handle: $collection) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;
