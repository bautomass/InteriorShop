import { NextResponse } from 'next/server';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { customerId } = data;

    // First revoke all customer tokens
    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
      },
      body: JSON.stringify({
        query: `
          mutation customerDelete($input: CustomerDeleteInput!) {
            customerDelete(input: $input) {
              deletedCustomerId
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            id: customerId
          }
        }
      })
    });

    const result = await response.json();

    if (result.data?.customerDelete?.userErrors?.length > 0) {
      return NextResponse.json(
        { error: result.data.customerDelete.userErrors[0].message },
        { status: 400 }
      );
    }

    // Clear any local storage tokens after successful deletion
    return NextResponse.json({ 
      success: true,
      message: 'Account deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}