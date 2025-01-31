// app/account/settings/page.tsx
'use client';

import AddressModal from '@/components/AddressModal';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import LargeScreenNavBar from '@/components/layout/navbar/LargeScreenNavBar';
import { shopifyFetch } from '@/lib/shopify/client/customerAuth';
import { useAuth } from '@/providers/AuthProvider';
import { CustomerAddress } from '@/types/account';
import { CheckCircle, Map, Phone, User, XCircle } from 'lucide-react';
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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [hasEditedProfile, setHasEditedProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    totalOrders: 0,
    joinedDate: '',
    loyaltyPoints: 0
  });

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
              metafields(
                identifiers: [
                  {namespace: "custom", key: "has_edited_profile"},
                  {namespace: "custom", key: "loyalty_points"},
                  {namespace: "custom", key: "joined_at"}
                ]
              ) {
                namespace
                key
                value
              }
              orders(first: 50) {
                totalCount
              }
            }
          }
        `,
        variables: {
          customerAccessToken: localStorage.getItem('shopifyCustomerAccessToken')
        }
      });

      const customerData = body.data.customer;
      
      // Update form data with null checks
      setFormData({
        firstName: customerData?.firstName || '',
        lastName: customerData?.lastName || '',
        email: customerData?.email || '',
        phone: customerData?.phone || '',
        acceptsMarketing: customerData?.acceptsMarketing || false
      });

      // Safe metafield access with null checks
      const metafields = customerData?.metafields || [];
      
      // Set has edited profile status
      const hasEditedMetafield = metafields.find(
        (field: any) => field && 
                        field.namespace === 'custom' && 
                        field.key === 'has_edited_profile' &&
                        field.value === 'true'
      );
      setHasEditedProfile(!!hasEditedMetafield);

      // Set addresses with null checks
      const defaultAddressId = customerData?.defaultAddress?.id;
      const addresses = customerData?.addresses?.edges?.map(({ node }: any) => ({
        ...node,
        isDefault: node.id === defaultAddressId
      })) || [];
      setAddresses(addresses);

      // Set customer details for deletion modal with safe access
      setCustomerDetails({
        firstName: customerData?.firstName || '',
        totalOrders: customerData?.orders?.totalCount || 0,
        joinedDate: metafields.find((f: any) => f && f.key === 'joined_at')?.value || new Date().toISOString(),
        loyaltyPoints: parseInt(
          metafields.find((f: any) => f && f.key === 'loyalty_points')?.value || '0',
          10
        )
      });

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
    setErrorMessage('');
  
    console.log('1. Starting profile update with user ID:', user?.id);
  
    try {
      const response = await fetch('/api/customer/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          acceptsMarketing: formData.acceptsMarketing,
          customerId: user?.id || ''
        })
      });
  
      const result = await response.json();
      console.log('2. Update response:', result);
  
      if (!response.ok) {
        setErrorMessage(result.error || 'Failed to update profile');
        throw new Error(result.error);
      }
  
      setSuccessMessage('Profile updated successfully. You will not be able to edit it again.');
      setIsEditing(false);
      setHasEditedProfile(true);
  
      // Immediately fetch fresh data
      await fetchCustomerData();
  
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (!errorMessage && error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = async (address: Omit<CustomerAddress, 'id' | 'isDefault'>) => {
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

  const handleUpdateAddress = async (addressData: Omit<CustomerAddress, 'id' | 'isDefault'>) => {
    if (!editingAddress?.id) return;
    try {
      const { body } = await shopifyFetch({
        query: `
          mutation customerAddressUpdate($customerAccessToken: String!, $addressId: ID!, $address: MailingAddressInput!) {
            customerAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId, address: $address) {
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
          addressId: editingAddress.id,
          address: addressData
        }
      });

      if (body.data.customerAddressUpdate.customerUserErrors.length > 0) {
        throw new Error(body.data.customerAddressUpdate.customerUserErrors[0].message);
      }

      fetchCustomerData();
      setSuccessMessage('Address updated successfully');
      setIsAddressModalOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const { body } = await shopifyFetch({
        query: `
          mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
            customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
              customerUserErrors {
                code
                field
                message
              }
              deletedCustomerAddressId
            }
          }
        `,
        variables: {
          customerAccessToken: localStorage.getItem('shopifyCustomerAccessToken'),
          id: addressId
        }
      });

      if (body.data.customerAddressDelete.customerUserErrors?.length > 0) {
        throw new Error(body.data.customerAddressDelete.customerUserErrors[0].message);
      }

      fetchCustomerData();
      setSuccessMessage('Address deleted successfully');
      setIsAddressModalOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error deleting address:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete address');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/customer/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user?.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete account');
      }

      // Clear local storage
      localStorage.removeItem('shopifyCustomerAccessToken');
      
      // Sign out and redirect to home
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete account');
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
    <LargeScreenNavBar />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile, addresses, and preferences
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

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
            {!hasEditedProfile && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-[#9e896c] hover:text-[#8a775d] font-medium"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>

          {/* Add warning banner */}
          {!hasEditedProfile && !isEditing && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You can edit your profile information only once. 
                Please make sure all information is correct before saving.
              </p>
            </div>
          )}

          {hasEditedProfile && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-600">
                You have already edited your profile information. 
                For any further changes, please contact customer support.
              </p>
            </div>
          )}

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
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2
                             focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm"
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
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2
                             focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2
                           focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2
                           focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm"
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

              {/* Update save button section */}
              {isEditing && !hasEditedProfile && (
                <div className="flex flex-col gap-2">
                  <div className="p-3 bg-[#9e896c]/10 rounded-md">
                    <p className="text-sm text-[#9e896c]">
                      ⚠️ This will be your only chance to edit your profile information. 
                        Please review carefully before saving.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-[#9e896c] text-white rounded-md
                               hover:bg-[#8a775d] focus:outline-none focus:ring-2
                               focus:ring-offset-2 focus:ring-[#9e896c]
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes (One-time Only)'}
                    </button>
                  </div>
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
              onClick={() => setIsAddressModalOpen(true)}
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
                    onClick={() => {
                      setEditingAddress(address);
                      setIsAddressModalOpen(true);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
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
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md
                       hover:bg-red-200 text-sm font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
        initialAddress={editingAddress || undefined}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleDeleteAccount}
        customerData={customerDetails}
      />
    </div>
  );
}