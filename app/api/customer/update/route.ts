import { NextResponse } from 'next/server';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, phone, acceptsMarketing, customerId } = data;
    
    console.log('1. Starting update process for customer:', customerId);

    // Check if customer has already edited their profile
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
        variables: { customerId }
      })
    });

    const checkResult = await checkResponse.json();
    console.log('2. Check metafields response:', checkResult);

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

    // Update customer and set metafield in one operation
    const updateResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
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
                metafields(first: 10) {
                  edges {
                    node {
                      id
                      namespace
                      key
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
          }
        `,
        variables: {
          input: {
            id: customerId,
            firstName,
            lastName,
            phone,
            acceptsMarketing,
            metafields: [{
              namespace: "custom",
              key: "has_edited_profile",
              value: "true",
              type: "single_line_text_field"
            }]
          }
        }
      })
    });

    const updateResult = await updateResponse.json();
    console.log('3. Update response:', updateResult);

    if (updateResult.data?.customerUpdate?.userErrors?.length > 0) {
      return NextResponse.json(
        { error: updateResult.data.customerUpdate.userErrors[0].message },
        { status: 400 }
      );
    }

    // Verify the changes
    const verifyResponse = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/customers/${customerId.split('/').pop()}/metafields.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
      }
    });

    const verifyResult = await verifyResponse.json();
    console.log('4. Final verification:', verifyResult);

    return NextResponse.json({ 
      success: true,
      customerData: updateResult.data?.customerUpdate?.customer
    });

  } catch (error) {
    console.error('Update process failed:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}






// import { NextResponse } from 'next/server';

// const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     const { firstName, lastName, phone, acceptsMarketing, customerId } = data;
    
//     console.log('1. Starting update process for customer:', customerId);

//     // Check if customer has already edited their profile
//     const checkResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
//       },
//       body: JSON.stringify({
//         query: `
//           query getCustomer($customerId: ID!) {
//             customer(id: $customerId) {
//               metafields(first: 10) {
//                 edges {
//                   node {
//                     namespace
//                     key
//                     value
//                   }
//                 }
//               }
//             }
//           }
//         `,
//         variables: { customerId }
//       })
//     });

//     const checkResult = await checkResponse.json();
//     console.log('2. Check metafields response:', checkResult);

//     const metafields = checkResult.data?.customer?.metafields?.edges || [];
//     const hasEditedProfile = metafields.some(
//       ({ node }: any) => node.namespace === 'custom' && 
//                         node.key === 'has_edited_profile' && 
//                         node.value === 'true'
//     );

//     if (hasEditedProfile) {
//       return NextResponse.json(
//         { error: 'Profile has already been edited once. Please contact customer support for further changes.' },
//         { status: 400 }
//       );
//     }

//     // Update customer and set metafield in one operation
//     const updateResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
//       },
//       body: JSON.stringify({
//         query: `
//           mutation customerUpdate($input: CustomerInput!) {
//             customerUpdate(input: $input) {
//               customer {
//                 id
//                 firstName
//                 lastName
//                 phone
//                 metafields(first: 10) {
//                   edges {
//                     node {
//                       id
//                       namespace
//                       key
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
//           }
//         `,
//         variables: {
//           input: {
//             id: customerId,
//             firstName,
//             lastName,
//             phone,
//             acceptsMarketing,
//             metafields: [{
//               namespace: "custom",
//               key: "has_edited_profile",
//               value: "true",
//               type: "single_line_text_field"
//             }]
//           }
//         }
//       })
//     });

//     const updateResult = await updateResponse.json();
//     console.log('3. Update response:', updateResult);

//     if (updateResult.data?.customerUpdate?.userErrors?.length > 0) {
//       return NextResponse.json(
//         { error: updateResult.data.customerUpdate.userErrors[0].message },
//         { status: 400 }
//       );
//     }

//     // Verify the changes
//     const verifyResponse = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/customers/${customerId.split('/').pop()}/metafields.json`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
//       }
//     });

//     const verifyResult = await verifyResponse.json();
//     console.log('4. Final verification:', verifyResult);

//     return NextResponse.json({ 
//       success: true,
//       customerData: updateResult.data?.customerUpdate?.customer
//     });

//   } catch (error) {
//     console.error('Update process failed:', error);
//     return NextResponse.json(
//       { error: 'Failed to update customer' },
//       { status: 500 }
//     );
//   }
// }
