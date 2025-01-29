// lib/shopify/loyalty/mutations.ts
export const getCustomerMetafieldsQuery = `
  query getCustomerMetafields($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      metafields(
        identifiers: [
          {namespace: "custom", key: "signup_points"},
          {namespace: "custom", key: "loyalty_points"},
          {namespace: "custom", key: "loyalty_tier"},
          {namespace: "custom", key: "points_to_next_tier"},
          {namespace: "custom", key: "total_spent"},
          {namespace: "custom", key: "joined_at"},
          {namespace: "custom", key: "loyalty_history"}
        ]
      ) {
        key
        value
      }
    }
  }
`;

export const updateCustomerMetafieldsQuery = `
  mutation customerUpdate($customerAccessToken: String!, $input: CustomerInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $input) {
      customer {
        id
        metafields(
          identifiers: [
            {namespace: "custom", key: "signup_points"},
            {namespace: "custom", key: "loyalty_points"},
            {namespace: "custom", key: "loyalty_tier"},
            {namespace: "custom", key: "points_to_next_tier"},
            {namespace: "custom", key: "total_spent"},
            {namespace: "custom", key: "joined_at"},
            {namespace: "custom", key: "loyalty_history"}
          ]
        ) {
          key
          value
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

export const initializeLoyaltyMutation = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
        tags
        metafields(
          identifiers: [
            {namespace: "custom", key: "signup_points"},
            {namespace: "custom", key: "loyalty_points"},
            {namespace: "custom", key: "loyalty_tier"},
            {namespace: "custom", key: "points_to_next_tier"},
            {namespace: "custom", key: "total_spent"},
            {namespace: "custom", key: "joined_at"},
            {namespace: "custom", key: "loyalty_history"}
          ]
        ) {
          key
          value
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