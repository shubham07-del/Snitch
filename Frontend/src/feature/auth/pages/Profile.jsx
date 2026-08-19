import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { useAddress } from '../../address/hooks/useAddress';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const { handleUpdateProfile, handleLogout } = useAuth();
  const { handleGetAllAddresses, handleCreateAddress, handleUpdateAddress, handleDeleteAddress } = useAddress();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullname: '',
    contact: '',
    email: '',
  });

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullname: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullname: user.fullname || '',
        contact: user.contact || '',
        email: user.email || '',
      });
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const fetchedAddresses = await handleGetAllAddresses();
      setAddresses(fetchedAddresses || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleUpdateProfile(profileForm);
      setIsEditingProfile(false);
    } catch (error) {
      console.error(error);
    }
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        fullname: address.fullname || '',
        phone: address.phone || '',
        email: address.email || '',
        address: address.address || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        country: address.country || 'India',
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        fullname: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
      });
    }
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  const onAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await handleUpdateAddress(editingAddress._id, addressForm);
        toast.success("Address updated successfully!");
      } else {
        await handleCreateAddress(addressForm);
        toast.success("Address added successfully!");
      }
      closeAddressModal();
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const onDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await handleDeleteAddress(id);
      toast.success("Address deleted successfully!");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f7f5]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5] font-sans text-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* ─── Personal Information ─── */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-lg font-bold">Personal Information</h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          <div className="px-6 py-6">
            {isEditingProfile ? (
              <form onSubmit={onProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.fullname}
                      onChange={(e) => setProfileForm({ ...profileForm, fullname: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={profileForm.contact}
                      onChange={(e) => setProfileForm({ ...profileForm, contact: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setProfileForm({
                        fullname: user.fullname || '',
                        contact: user.contact || '',
                        email: user.email || '',
                      });
                    }}
                    className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{user.fullname}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{user.contact || 'Not provided'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{user.email}</dd>
                </div>
              </dl>
            )}
          </div>
        </div>

        {/* ─── Addresses ─── */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5 bg-gray-50/50">
            <h2 className="text-lg font-bold">Addresses</h2>
          </div>

          <div className="px-6 py-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-4">You haven't saved any addresses yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <div key={addr._id} className="relative rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                    <h3 className="font-bold text-sm mb-2">{addr.fullname}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{addr.address}</p>
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p>{addr.country}</p>
                      <p className="pt-2 font-medium text-gray-900">Phone: {addr.phone}</p>
                    </div>
                    <div className="mt-4 flex gap-4 border-t border-gray-100 pt-3">
                      <button
                        onClick={() => openAddressModal(addr)}
                        className="text-xs font-semibold text-gray-600 hover:text-black transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteAddress(addr._id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => openAddressModal()}
              className="mt-6 inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors w-full justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Address
            </button>
          </div>
        </div>
      </div>

      {/* ─── Address Modal ─── */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeAddressModal} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            
            <form onSubmit={onAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullname}
                    onChange={(e) => setAddressForm({ ...addressForm, fullname: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={addressForm.email}
                    onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase">Address Line</label>
                  <input
                    type="text"
                    required
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase">City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase">State</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase">Pincode</label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase">Country</label>
                  <input
                    type="text"
                    required
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="flex-1 sm:flex-none rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 shadow-md transition-all"
                >
                  {editingAddress ? 'Save Changes' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;