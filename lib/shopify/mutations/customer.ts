// lib/shopify/mutations/customer.ts - COPY AND REPLACE ENTIRE FILE

export const customerQuery = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      displayName
      phone
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

export const customerAccessTokenCreateMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const customerCreateMutation = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const customerAccessTokenDeleteMutation = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;