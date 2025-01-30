import { NextResponse } from 'next/server';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, phone, acceptsMarketing, customerId } = data;

    // First, check if customer has already edited their profile
    const checkResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
      },
      body: JSON.stringify({
        query: `
          query getCustomer($customerId: ID!) {
            customer(id: $customerId) {
              metafields(first: 10) {
                edges {
                  node {
                    namespace
                    key
                    value
                  }
                }
              }
            }
          }
        `,
        variables: {
          customerId
        }
      })
    });

    const checkResult = await checkResponse.json();
    const metafields = checkResult.data?.customer?.metafields?.edges || [];
    const hasEditedProfile = metafields.some(
      ({ node }: any) => node.namespace === 'custom' && 
                        node.key === 'has_edited_profile' && 
                        node.value === 'true'
    );

    if (hasEditedProfile) {
      return NextResponse.json(
        { error: 'Profile has already been edited once. Please contact customer support for further changes.' },
        { status: 400 }
      );
    }

    // If not edited before, proceed with update
    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
      },
      body: JSON.stringify({
        query: `
          mutation customerUpdate($input: CustomerInput!) {
            customerUpdate(input: $input) {
              customer {
                id
                firstName
                lastName
                phone
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            id: customerId,
            firstName,
            lastName,
            phone,
            acceptsMarketing
          }
        }
      })
    });

    const customerResult = await response.json();

    // Check for customer update errors
    if (customerResult.data?.customerUpdate?.userErrors?.length > 0) {
      return NextResponse.json(
        { error: customerResult.data.customerUpdate.userErrors[0].message },
        { status: 400 }
      );
    }

    // Update metafield
    const metafieldResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
      },
      body: JSON.stringify({
        query: `
          mutation metafieldUpsert($input: MetafieldInput!) {
            metafieldUpsert(input: $input) {
              metafield {
                id
                key
                value
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            ownerId: customerId,
            namespace: "custom",
            key: "has_edited_profile",
            value: "true",
            type: "single_line_text_field"
          }
        }
      })
    });

    const metafieldResult = await metafieldResponse.json();

    if (metafieldResult.data?.metafieldUpsert?.userErrors?.length > 0) {
      return NextResponse.json(
        { error: metafieldResult.data.metafieldUpsert.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}