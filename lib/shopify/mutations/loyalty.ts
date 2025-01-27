// lib/shopify/mutations/loyalty.ts

export const updateCustomerLoyaltyMutation = `
  mutation updateCustomerMetafields($input: CustomerInput!) {
    customerUpdate(input: $input) {
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

export const getCustomerLoyaltyQuery = `
  query getCustomerLoyalty($customerAccessToken: String!) {
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