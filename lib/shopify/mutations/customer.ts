// lib/shopify/mutations/customer.ts

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
          {namespace: "custom", key: "signup_points"},
          {namespace: "custom", key: "loyalty_points"},
          {namespace: "custom", key: "loyalty_tier"},
          {namespace: "custom", key: "points_to_next_tier"},
          {namespace: "custom", key: "total_spent"},
          {namespace: "custom", key: "joined_at"},
          {namespace: "custom", key: "loyalty_history"}
          {namespace: "custom", key: "has_edited_profile"} 
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

export const customerMetafieldUpdateMutation = `
  mutation customerMetafieldUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        firstName
        lastName
        phone
        metafields(
          identifiers: [
            {namespace: "custom", key: "has_edited_profile"}
          ]
        ) {
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const getCustomerMetafieldsQuery = `
  query getCustomerMetafields($customerId: ID!) {
    customer(id: $customerId) {
      metafields(
        identifiers: [
          {namespace: "custom", key: "has_edited_profile"}
        ]
      ) {
        key
        value
      }
    }
  }
`;