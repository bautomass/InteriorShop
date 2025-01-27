// app/account/settings/page.tsx
'use client';

import { shopifyFetch } from '@/lib/shopify/client/customerAuth';
import { useAuth } from '@/providers/AuthProvider';
import { CustomerAddress } from '@/types/account';
import { CheckCircle, Map, Phone, User } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [activeSection, setActiveSection] = useState<'profile' | 'addresses' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    acceptsMarketing: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchCustomerData = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { body } = await shopifyFetch({
        query: `
          query getCustomerDetails($customerAccessToken: String!) {
            customer(customerAccessToken: $customerAccessToken) {
              firstName
              lastName
              email
              phone
              acceptsMarketing
              addresses(first: 10) {
                edges {
                  node {
                    id
                    firstName
                    lastName
                    company
                    address1
                    address2
                    city
                    province
                    zip
                    country
                    phone
                  }
                }
              }
              defaultAddress {
                id
              }
            }
          }
        `,
        variables: {
          customerAccessToken: localStorage.getItem('shopifyCustomerAccessToken')
        }
      });

      const customerData = body.data.customer;
      setFormData({
        firstName: customerData.firstName || '',
        lastName: customerData.lastName || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        acceptsMarketing: customerData.acceptsMarketing
      });

      const defaultAddressId = customerData.defaultAddress?.id;
      const addresses = customerData.addresses.edges.map(({ node }: any) => ({
        ...node,
        isDefault: node.id === defaultAddressId
      }));
      setAddresses(addresses);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { body } = await shopifyFetch({
        query: `
          mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
            customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
              customer {
                id
                firstName
                lastName
                email
                phone
              }
              customerUserErrors {
                code
                field
                message
              }
            }
          }
        `,
        variables: {
          customerAccessToken: localStorage.getItem('shopifyCustomerAccessToken'),
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            acceptsMarketing: formData.acceptsMarketing
          }
        }});

        if (body.data.customerUpdate.customerUserErrors.length > 0) {
          throw new Error(body.data.customerUpdate.customerUserErrors[0].message);
        }
  
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setIsSaving(false);
      }
    };
  
    const handleAddAddress = async (address: Omit<CustomerAddress, 'id'>) => {
      try {
        const { body } = await shopifyFetch({
          query: `
            mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
              customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
                customerAddress {
                  id
                }
                customerUserErrors {
                  code
                  field
                  message
                }
              }
            }
          `,
          variables: {
            customerAccessToken: localStorage.getItem('shopifyCustomerAccessToken'),
            address
          }
        });
  
        if (body.data.customerAddressCreate.customerUserErrors.length > 0) {
          throw new Error(body.data.customerAddressCreate.customerUserErrors[0].message);
        }
  
        fetchCustomerData();
        setSuccessMessage('Address added successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error adding address:', error);
      }
    };
  
    const handleSetDefaultAddress = async (addressId: string) => {
      try {
        const { body } = await shopifyFetch({
          query: `
            mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
              customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
                customer {
                  id
                }
                customerUserErrors {
                  code
                  field
                  message
                }
              }
            }
          `,
          variables: {
            customerAccessToken: localStorage.getItem('shopifyCustomerAccessToken'),
            addressId
          }
        });
  
        if (body.data.customerDefaultAddressUpdate.customerUserErrors.length > 0) {
          throw new Error(body.data.customerDefaultAddressUpdate.customerUserErrors[0].message);
        }
  
        fetchCustomerData();
      } catch (error) {
        console.error('Error setting default address:', error);
      }
    };
  
    if (isLoading) {
      return (
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9e896c]" />
        </div>
      );
    }
  
    return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your profile, addresses, and preferences
          </p>
        </div>
  
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}
  
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveSection('profile')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md
              ${activeSection === 'profile' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSection('addresses')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md
              ${activeSection === 'addresses' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'}`}
          >
            Addresses
          </button>
          <button
            onClick={() => setActiveSection('preferences')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md
              ${activeSection === 'preferences' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'}`}
          >
            Preferences
          </button>
        </div>
  
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-[#9e896c] hover:text-[#8a775d] font-medium"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
  
            <form onSubmit={handleUpdateProfile}>
              <div className="grid grid-cols-1 gap-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                               focus:border-[#9e896c] focus:ring-[#9e896c] disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                               focus:border-[#9e896c] focus:ring-[#9e896c] disabled:bg-gray-50"
                    />
                  </div>
                </div>
  
                {/* Email & Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                             focus:border-[#9e896c] focus:ring-[#9e896c] disabled:bg-gray-50"
                  />
                </div>
  
                {/* Marketing Preferences */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="acceptsMarketing"
                    checked={formData.acceptsMarketing}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      acceptsMarketing: e.target.checked 
                    }))}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-[#9e896c] 
                             focus:ring-[#9e896c] disabled:opacity-50"
                  />
                  <label htmlFor="acceptsMarketing" className="text-sm text-gray-700">
                    I want to receive marketing emails
                  </label>
                </div>
  
                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-[#9e896c] text-white rounded-md
                               hover:bg-[#8a775d] focus:outline-none focus:ring-2
                               focus:ring-offset-2 focus:ring-[#9e896c]
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
  
        {/* Addresses Section */}
        {activeSection === 'addresses' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Shipping Addresses</h2>
              <button
                onClick={() => {/* Add new address modal */}}
                className="px-4 py-2 bg-[#9e896c] text-white rounded-md
                         hover:bg-[#8a775d] text-sm font-medium"
              >
                Add New Address
              </button>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 rounded-lg border ${
                    address.isDefault 
                      ? 'border-[#9e896c] bg-[#9e896c]/5' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">
                        {address.firstName} {address.lastName}
                      </p>
                    </div>
                    {address.isDefault && (
                      <span className="text-xs font-medium text-[#9e896c] bg-[#9e896c]/10 
                                     px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Map className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {address.address1}
                        {address.address2 && `, ${address.address2}`}
                        <br />
                        {address.city}, {address.province} {address.zip}
                        <br />
                        {address.country}
                      </p>
                    </div>
                    {address.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      </div>
                    )}
                  </div>
  
                  <div className="mt-4 flex justify-end gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(address.id)}
                        className="text-sm text-[#9e896c] hover:text-[#8a775d] font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => {/* Edit address modal */}}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Preferences Section */}
        {activeSection === 'preferences' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Communication Preferences
            </h2>
  
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.acceptsMarketing}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      acceptsMarketing: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-[#9e896c] 
                             focus:ring-[#9e896c]"
                  />
                  <span className="text-sm text-gray-700">Email Marketing</span>
                </label>
                <p className="mt-1 text-sm text-gray-500 ml-6">
                  Receive updates about new products, sales, and exclusive offers
                </p>
              </div>
  
              {/* Add more preference options as needed */}
            </div>
  
            {/* Account Deletion */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-red-600 mb-2">
                Delete Account
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => {/* Show delete confirmation modal */}}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md
                         hover:bg-red-200 text-sm font-medium"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }