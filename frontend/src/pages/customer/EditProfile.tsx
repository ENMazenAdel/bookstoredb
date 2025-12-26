/**
 * ============================================================================
 * EDIT PROFILE PAGE (Customer)
 * ============================================================================
 * 
 * Dedicated page for editing user profile information.
 * Provides a full-page form for updating all profile fields.
 * 
 * FEATURES:
 * 1. Edit all profile information in one place
 * 2. Optional password change functionality
 * 3. Form validation with required fields
 * 4. Success message with auto-redirect
 * 
 * EDITABLE FIELDS:
 * - First Name (required)
 * - Last Name (required)
 * - Email (required)
 * - Phone (required)
 * - Shipping Address (required)
 * - Password (optional - leave blank to keep current)
 * 
 * FLOW:
 * 1. User navigates to /edit-profile
 * 2. Form is pre-filled with current user data
 * 3. User makes changes and submits
 * 4. On success, redirect back to profile page
 * 
 * ACCESS: Authenticated users only
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React imports for component and state management
import React, { useState } from 'react';

// Auth context for user data
import { useAuth } from '../../context/AuthContext';

// Router hook for navigation
import { useNavigate } from 'react-router-dom';

// API service for profile updates
import { authApi } from '../../services/api';

// Icons for visual enhancement
import { FaUserEdit, FaSave } from 'react-icons/fa';

/**
 * EditProfile Component
 * 
 * Full-page form for editing user profile.
 * Includes optional password change functionality.
 */
const EditProfile: React.FC = () => {
    // ========================================
    // HOOKS AND CONTEXT
    // ========================================
    
    // Get current user from auth context
    // Note: We use login to update the user in context after profile update
    const { user, login } = useAuth();
    
    // Navigation hook for redirect after save
    const navigate = useNavigate();

    // ========================================
    // STATE MANAGEMENT
    // ========================================

    // Form data initialized from current user data
    // Password is intentionally empty - only filled if user wants to change it
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        shippingAddress: user?.shippingAddress || '',
        // Don't pre-fill password for security, only allow changing it
        password: ''
    });

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // ========================================
    // EVENT HANDLERS
    // ========================================

    /**
     * Handles form input changes
     * @param e - Change event from input/textarea
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Handles form submission
     * Updates profile via API and redirects on success
     * @param e - Form submit event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;  // Safety check

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Prepare update data - don't send empty password
            const updateData: Record<string, string> = { ...formData };
            if (!updateData.password) {
                delete updateData.password;  // Remove empty password field
            }

            // Call API to update profile
            const updatedUser = await authApi.updateProfile(user.id, updateData);

            // Note: In a production app, we'd have a dedicated 'updateUser' method
            // in the auth context to update the local user state

            setSuccess('Profile updated successfully!');
            // Redirect back to profile page after short delay
            setTimeout(() => navigate('/profile'), 1500);

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    // ========================================
    // RENDER
    // ========================================

    // Deny access if no user is logged in
    if (!user) return <div>Access Denied</div>;

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        {/* Card Header */}
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">
                                <FaUserEdit className="me-2" />
                                Edit Profile
                            </h4>
                        </div>
                        <div className="card-body p-4">

                            {/* Error and Success Messages */}
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <form onSubmit={handleSubmit}>
                                {/* Name Fields - Side by Side */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
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
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Phone Field */}
                                <div className="mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Shipping Address Field */}
                                <div className="mb-3">
                                    <label className="form-label">Shipping Address</label>
                                    <textarea
                                        className="form-control"
                                        name="shippingAddress"
                                        rows={3}
                                        value={formData.shippingAddress}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <hr className="my-4" />
                                
                                {/* Password Change Section */}
                                <h5 className="mb-3">Change Password</h5>
                                <p className="text-muted small">Leave blank if you don't want to change it.</p>

                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="New password"
                                        minLength={6}
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                        {isLoading ? 'Saving...' : (
                                            <>
                                                <FaSave className="me-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
