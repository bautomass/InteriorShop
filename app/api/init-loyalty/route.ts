import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Debug logs
    console.log('Environment variables:', {
      domain: process.env.SHOPIFY_STORE_DOMAIN,
      hasAdminToken: !!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
    });

    const signupBonus = 88;
    const now = new Date().toISOString();
    const historyEntry = {
      id: Date.now().toString(),
      type: "earned",
      points: signupBonus,
      description: "Signup bonus for joining our loyalty program!",
      date: now
    };

    // Format the customer ID correctly
    const formattedCustomerId = customerId.includes('gid://') 
      ? customerId 
      : `gid://shopify/Customer/${customerId.split('/').pop()}`;

    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN as string
        },
        body: JSON.stringify({
          query: `mutation customerUpdate($input: CustomerInput!) {
            customerUpdate(input: $input) {
              customer {
                id
                metafields(first: 10) {
                  edges {
                    node {
                      key
                      namespace
                      value
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
          }`,
          variables: {
            input: {
              id: formattedCustomerId,
              metafields: [
                {
                  namespace: "custom",
                  key: "signup_points",
                  value: signupBonus.toString(),
                  type: "number_integer"
                },
                {
                  namespace: "custom",
                  key: "loyalty_points",
                  value: signupBonus.toString(),
                  type: "number_integer"
                },
                {
                  namespace: "custom",
                  key: "loyalty_tier",
                  value: "bronze",
                  type: "single_line_text_field"
                },
                {
                  namespace: "custom",
                  key: "points_to_next_tier",
                  value: "912",
                  type: "number_integer"
                },
                {
                  namespace: "custom",
                  key: "total_spent",
                  value: "0.0",
                  type: "number_decimal"
                },
                {
                  namespace: "custom",
                  key: "joined_at",
                  value: now,
                  type: "date_time"
                },
                {
                  namespace: "custom",
                  key: "loyalty_history",
                  value: JSON.stringify([historyEntry]),
                  type: "json"
                }
              ]
            }
          }
        })
      }
    );

    const data = await response.json();

    // If there's a GraphQL error
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return NextResponse.json(
        { message: data.errors[0].message },
        { status: 400 }
      );
    }

    // If there's a user error
    if (data.data?.customerUpdate?.userErrors?.length > 0) {
      console.error('User Errors:', data.data.customerUpdate.userErrors);
      return NextResponse.json(
        { message: data.data.customerUpdate.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    // More detailed error logging
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { message: 'Error initializing loyalty program', details: error instanceof Error ? error.message : undefined },
      { status: 500 }
    );
  }
}

















// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   try {
//     const { customerId } = await req.json();

//     if (!customerId) {
//       return NextResponse.json(
//         { message: 'Customer ID is required' },
//         { status: 400 }
//       );
//     }

//     const signupBonus = 108;
//     const now = new Date().toISOString();
//     const historyEntry = {
//       id: Date.now().toString(),
//       type: "earned",
//       points: signupBonus,
//       description: "Signup bonus for joining our loyalty program!",
//       date: now
//     };

//     // Format the customer ID correctly for Shopify Admin API
//     const formattedCustomerId = customerId.includes('gid://') 
//       ? customerId 
//       : `gid://shopify/Customer/${customerId.split('/').pop()}`;

//     const response = await fetch(
//       `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN as string
//         },
//         body: JSON.stringify({
//           query: `mutation customerUpdate($input: CustomerInput!) {
//             customerUpdate(input: $input) {
//               customer {
//                 id
//                 metafields(first: 10) {
//                   edges {
//                     node {
//                       key
//                       namespace
//                       value
//                     }
//                   }
//                 }
//               }
//               userErrors {
//                 field
//                 message
//               }
//             }
//           }`,
//           variables: {
//             input: {
//               id: formattedCustomerId,
//               metafields: [
//                 {
//                   namespace: "custom",
//                   key: "signup_points",
//                   value: signupBonus.toString(),
//                   type: "number_integer"
//                 },
//                 {
//                   namespace: "custom",
//                   key: "loyalty_points",
//                   value: signupBonus.toString(),
//                   type: "number_integer"
//                 },
//                 {
//                   namespace: "custom",
//                   key: "loyalty_tier",
//                   value: "bronze",
//                   type: "single_line_text_field"
//                 },
//                 {
//                   namespace: "custom",
//                   key: "points_to_next_tier",
//                   value: "912",
//                   type: "number_integer"
//                 },
//                 {
//                   namespace: "custom",
//                   key: "total_spent",
//                   value: "0.0",
//                   type: "number_decimal"
//                 },
//                 {
//                   namespace: "custom",
//                   key: "joined_at",
//                   value: now,
//                   type: "date_time"
//                 },
//                 {
//                   namespace: "custom",
//                   key: "loyalty_history",
//                   value: JSON.stringify([historyEntry]),
//                   type: "json"
//                 }
//               ]
//             }
//           }
//         })
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Shopify Error:', errorData);
//       throw new Error('Failed to initialize loyalty');
//     }

//     const data = await response.json();
//     if (data.errors) {
//       console.error('GraphQL Errors:', data.errors);
//       throw new Error(data.errors[0].message);
//     }

//     console.log('Successfully initialized loyalty:', data);
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error initializing loyalty:', error);
//     return NextResponse.json(
//       { message: 'Error initializing loyalty program' },
//       { status: 500 }
//     );
//   }
// }
