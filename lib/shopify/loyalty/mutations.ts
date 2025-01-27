// lib/shopify/loyalty/mutations.ts - COPY AND REPLACE ENTIRE FILE

export const getCustomerMetafieldsQuery = `
  query getCustomerMetafields($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      metafields(
        identifiers: [
          {namespace: "custom", key: "custom.loyalty_points"},
          {namespace: "custom", key: "custom.loyalty_tier"},
          {namespace: "custom", key: "custom.points_to_next_tier"},
          {namespace: "custom", key: "custom.total_spent"},
          {namespace: "custom", key: "custom.joined_at"},
          {namespace: "custom", key: "custom.loyalty_history"}
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
    customerUpdate(customerAccessToken: $customerAccessToken, input: $input) {
      customer {
        id
        metafields(
          identifiers: [
            {namespace: "custom", key: "custom.loyalty_points"},
            {namespace: "custom", key: "custom.loyalty_tier"},
            {namespace: "custom", key: "custom.points_to_next_tier"},
            {namespace: "custom", key: "custom.total_spent"},
            {namespace: "custom", key: "custom.joined_at"},
            {namespace: "custom", key: "custom.loyalty_history"}
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