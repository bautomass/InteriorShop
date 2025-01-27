// lib/shopify/loyalty/mutations.ts

export const updateCustomerMetafieldsQuery = `
  mutation customerUpdate($customerAccessToken: String!, $input: CustomerInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, input: $input) {
      customer {
        id
        metafields(first: 10) {
          edges {
            node {
              id
              key
              value
            }
          }
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const getCustomerMetafieldsQuery = `
  query getCustomerMetafields($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      metafields(first: 10) {
        edges {
          node {
            id
            key
            value
          }
        }
      }
    }
  }
`;