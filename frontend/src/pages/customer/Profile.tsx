/**
 * ============================================================================
 * PROFILE PAGE (Customer)
 * ============================================================================
 * 
 * Page for viewing and editing the user's profile information.
 * Available to authenticated users only.
 * 
 * FEATURES:
 * 1. View profile information (read-only by default)
 * 2. Toggle edit mode to modify fields
 * 3. Save changes to the backend
 * 4. Cancel edits and revert changes
 * 
 * EDITABLE FIELDS:
 * - First Name
 * - Last Name
 * - Email
 * - Phone
 * - Shipping Address
 * 
 * NON-EDITABLE FIELDS:
 * - Username (unique identifier)
 * - Role (admin/customer)
 * 
 * ACCESS: Authenticated users only
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React imports for component and state management
import React, { useState } from 'react';

// Auth context for user data and update function
import { useAuth } from '../../context/AuthContext';

// Icons for visual enhancement
import { FaUser, FaSave, FaEdit } from 'react-icons/fa';

/**
 * Profile Component
 * 
 * Displays user profile with inline editing capability.
 * Toggles between view and edit modes.
 */
const Profile: React.FC = () => {
  // ========================================
  // HOOKS AND CONTEXT
  // ========================================
  
  // Get user data and update function from auth context
  const { user, updateProfile } = useAuth();

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Edit mode toggle - when true, fields become editable
  const [isEditing, setIsEditing] = useState(false);
  
  // Form data initialized from current user data
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    shippingAddress: user?.shippingAddress || ''
  });
  
  // UI state for feedback messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  /**
   * Handles form input changes
   * Updates the corresponding field in formData
   * @param e - Change event from input/textarea
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission
   * Sends updated profile data to the backend
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);  // Exit edit mode on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancels editing and reverts form data to original values
   */
  const handleCancel = () => {
    // Reset form data to current user values
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      shippingAddress: user?.shippingAddress || ''
    });
    setIsEditing(false);
    setError('');
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            {/* Card Header with Edit Button */}
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaUser className="me-2" />
                My Profile
              </h5>
              {/* Show edit button only when not in edit mode */}
              {!isEditing && (
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="me-1" />
                  Edit
                </button>
              )}
            </div>
            <div className="card-body">
              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {/* Success Alert */}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Non-editable fields: Username and Role */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user?.username || ''}
                      disabled
                    />
                    <small className="text-muted">Username cannot be changed</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user?.role === 'admin' ? 'Administrator' : 'Customer'}
                      disabled
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Shipping Address</label>
                  <textarea
                    className="form-control"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    required
                  />
                </div>

                {isEditing && (
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-1" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
