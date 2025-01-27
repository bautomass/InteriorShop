// lib/shopify/types/customer.ts

export type ShopifyCustomer = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    displayName?: string;
  };
  
  export type CustomerAccessToken = {
    accessToken: string;
    expiresAt: string;
  };
  
  export type CustomerUserError = {
    code?: string;
    field?: string[];
    message: string;
  };
  
  export type ShopifyCustomerOperation = {
    data: {
      customer: ShopifyCustomer;
    };
  };
  
  export type CustomerAccessTokenCreateOperation = {
    data: {
      customerAccessTokenCreate: {
        customerAccessToken: CustomerAccessToken | null;
        customerUserErrors: CustomerUserError[];
      };
    };
    variables: {
      input: {
        email: string;
        password: string;
      };
    };
  };
  
  export type CustomerCreateOperation = {
    data: {
      customerCreate: {
        customer: ShopifyCustomer | null;
        customerUserErrors: CustomerUserError[];
      };
    };
    variables: {
      input: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
      };
    };
  };
  
  export type CustomerAccessTokenDeleteOperation = {
    data: {
      customerAccessTokenDelete: {
        deletedAccessToken: string | null;
        deletedCustomerAccessTokenId: string | null;
        userErrors: CustomerUserError[];
      };
    };
    variables: {
      customerAccessToken: string;
    };
  };