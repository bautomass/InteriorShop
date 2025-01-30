import { NextResponse } from 'next/server';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, phone, acceptsMarketing, customerId } = data;
    
    console.log('1. Received update request with data:', { firstName, lastName, phone, acceptsMarketing, customerId });

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
    console.log('2. Check metafields response:', checkResult);

    const metafields = checkResult.data?.customer?.metafields?.edges || [];
    const hasEditedProfile = metafields.some(
      ({ node }: any) => node.namespace === 'custom' && 
                        node.key === 'has_edited_profile' && 
                        node.value === 'true'
    );

    console.log('3. Has edited profile:', hasEditedProfile);

    if (hasEditedProfile) {
      console.log('4. Blocking update - profile already edited');
      return NextResponse.json(
        { error: 'Profile has already been edited once. Please contact customer support for further changes.' },
        { status: 400 }
      );
    }

    // Update customer data and metafield in one mutation
    console.log('5. Proceeding with customer update');
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
            metafields: [
              {
                namespace: "custom",
                key: "has_edited_profile",
                value: "true",
                type: "single_line_text_field"
              }
            ]
          }
        }
      })
    });

    const customerResult = await response.json();
    console.log('6. Customer update response:', customerResult);

    // Check for customer update errors
    if (customerResult.data?.customerUpdate?.userErrors?.length > 0) {
      console.log('7. Customer update failed:', customerResult.data.customerUpdate.userErrors);
      return NextResponse.json(
        { error: customerResult.data.customerUpdate.userErrors[0].message },
        { status: 400 }
      );
    }

    // Check if metafield was set in the update
    const customerMetafields = customerResult.data?.customerUpdate?.customer?.metafields?.edges || [];
    const wasMetafieldSet = customerMetafields.some(
      ({ node }: any) => node.namespace === 'custom' && 
                        node.key === 'has_edited_profile' && 
                        node.value === 'true'
    );

    console.log('8. Metafield was set in update:', wasMetafieldSet);

    // If metafield wasn't set, try setting it separately
    if (!wasMetafieldSet) {
      console.log('9. Attempting separate metafield update');
      const metafieldResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
        },
        body: JSON.stringify({
          query: `
            mutation customerMetafieldSet($input: CustomerMetafieldInput!) {
              customerMetafieldSet(input: $input) {
                metafield {
                  id
                  namespace
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
              customerId: customerId,
              namespace: "custom",
              key: "has_edited_profile",
              type: "SINGLE_LINE_TEXT_FIELD",
              value: "true"
            }
          }
        })
      });

      const metafieldResult = await metafieldResponse.json();
      console.log('10. Separate metafield update response:', metafieldResult);

      if (metafieldResult.data?.customerMetafieldSet?.userErrors?.length > 0) {
        console.error('11. Error setting metafield:', metafieldResult.data.customerMetafieldSet.userErrors);
      }
    }

    console.log('12. Update completed successfully');
    return NextResponse.json({ 
      success: true,
      customerData: customerResult.data?.customerUpdate?.customer
    });
  } catch (error) {
    console.error('13. Error in update process:', error);
    return NextResponse.json(
      { error: 'Failed to update customer', details: error instanceof Error ? error.message : String(error) },
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

//     // First, check if customer has already edited their profile
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
//         variables: {
//           customerId
//         }
//       })
//     });

//     const checkResult = await checkResponse.json();
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

//     // Update customer data and metafield in one mutation
//     const response = await fetch(SHOPIFY_ADMIN_API_URL, {
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
//             metafields: [
//               {
//                 namespace: "custom",
//                 key: "has_edited_profile",
//                 value: "true",
//                 type: "single_line_text_field"
//               }
//             ]
//           }
//         }
//       })
//     });

//     const customerResult = await response.json();

//     // Check for customer update errors
//     if (customerResult.data?.customerUpdate?.userErrors?.length > 0) {
//       return NextResponse.json(
//         { error: customerResult.data.customerUpdate.userErrors[0].message },
//         { status: 400 }
//       );
//     }

//     // If customer update was successful but metafield wasn't set, try setting it separately
//     const customerMetafields = customerResult.data?.customerUpdate?.customer?.metafields?.edges || [];
//     const wasMetafieldSet = customerMetafields.some(
//       ({ node }: any) => node.namespace === 'custom' && 
//                         node.key === 'has_edited_profile' && 
//                         node.value === 'true'
//     );

//     if (!wasMetafieldSet) {
//       const metafieldResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
//         },
//         body: JSON.stringify({
//           query: `
//             mutation customerMetafieldSet($input: CustomerMetafieldInput!) {
//               customerMetafieldSet(input: $input) {
//                 metafield {
//                   id
//                   namespace
//                   key
//                   value
//                 }
//                 userErrors {
//                   field
//                   message
//                 }
//               }
//             }
//           `,
//           variables: {
//             input: {
//               customerId: customerId,
//               namespace: "custom",
//               key: "has_edited_profile",
//               type: "SINGLE_LINE_TEXT_FIELD",
//               value: "true"
//             }
//           }
//         })
//       });

//       const metafieldResult = await metafieldResponse.json();

//       if (metafieldResult.data?.customerMetafieldSet?.userErrors?.length > 0) {
//         console.error('Error setting metafield:', metafieldResult.data.customerMetafieldSet.userErrors);
//         // Don't return error here as the customer update was successful
//       }
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error updating customer:', error);
//     return NextResponse.json(
//       { error: 'Failed to update customer' },
//       { status: 500 }
//     );
//   }
// }












// import { NextResponse } from 'next/server';


// const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     const { firstName, lastName, phone, acceptsMarketing, customerId } = data;

//     // First, check if customer has already edited their profile
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
//               metafield(namespace: "custom", key: "has_edited_profile") {
//                 id
//                 value
//               }
//             }
//           }
//         `,
//         variables: {
//           customerId
//         }
//       })
//     });

//     const checkResult = await checkResponse.json();
//     const hasEditedProfile = checkResult.data?.customer?.metafield?.value === 'true';

//     if (hasEditedProfile) {
//       return NextResponse.json(
//         { error: 'Profile has already been edited once. Please contact customer support for further changes.' },
//         { status: 400 }
//       );
//     }

//     // If not edited before, proceed with update
//     const response = await fetch(SHOPIFY_ADMIN_API_URL, {
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
//             acceptsMarketing
//           }
//         }
//       })
//     });

//     const customerResult = await response.json();

//     // Check for customer update errors
//     if (customerResult.data?.customerUpdate?.userErrors?.length > 0) {
//       return NextResponse.json(
//         { error: customerResult.data.customerUpdate.userErrors[0].message },
//         { status: 400 }
//       );
//     }

//     // Update metafield
//     const metafieldResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
//       },
//       body: JSON.stringify({
//         query: `
//           mutation customerMetafieldSet($input: CustomerMetafieldInput!) {
//             customerMetafieldSet(input: $input) {
//               metafield {
//                 id
//                 key
//                 value
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
//             customerId: customerId,
//             namespace: "custom",
//             key: "has_edited_profile",
//             type: "single_line_text_field",
//             value: "true"
//           }
//         }
//       })
//     });

//     const metafieldResult = await metafieldResponse.json();

//     if (metafieldResult.data?.customerMetafieldSet?.userErrors?.length > 0) {
//       return NextResponse.json(
//         { error: metafieldResult.data.customerMetafieldSet.userErrors[0].message },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error updating customer:', error);
//     return NextResponse.json(
//       { error: 'Failed to update customer' },
//       { status: 500 }
//     );
//   }
// }