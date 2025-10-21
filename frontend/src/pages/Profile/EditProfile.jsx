import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosService";
import "./EditProfile.css";

export default function EditProfile() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const userId = localStorage.getItem("userId");

    const [formData, setFormData] = useState({
        username: storedUser.username || "",
        firstName: storedUser.firstName || "",
        lastName: storedUser.lastName || "",
        bio: storedUser.bio || "",
        gender: storedUser.gender || "",
        country: storedUser.country || "",
        city: storedUser.city || "",
        relationship: storedUser.relationship || "Single",
        password: "",
        confirmPassword: "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(storedUser.profilePicture || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const textData = {
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName,
                bio: formData.bio,
                gender: formData.gender,
                country: formData.country,
                city: formData.city,
                relationship: formData.relationship,
                password: formData.password || undefined, // send only if changed
            };

            // update user data
            const response = await axiosInstance.put(`api/v1/users/${userId}`, textData);
            const updatedUser = response.data.user || response.data;
            const newToken = response.data.token;

            // update local storage
            localStorage.setItem("user", JSON.stringify(updatedUser));
            if (newToken) {
                localStorage.setItem("token", newToken);
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            }


            if (profileImage) {
                const imageData = new FormData();
                imageData.append("profilePicture", profileImage);

                const imageResponse = await axiosInstance.put(
                    `api/v1/users/${userId}/profile-picture`,
                    imageData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                const userWithImage = imageResponse.data.user || updatedUser;
                localStorage.setItem("user", JSON.stringify(userWithImage));
                if (imageResponse.data.token) {
                    localStorage.setItem("token", imageResponse.data.token);
                    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${imageResponse.data.token}`;
                }
            }

            alert("Profile updated successfully!");

            navigate(`/profile/${userId}`);
            window.location.reload();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="image-section">
                    <img
                        src={previewImage || "https://via.placeholder.com/150"}
                        alt="Profile preview"
                        className="profile-preview"
                    />
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "Uploade Picture" }} />
                </div>

                <div className="form-fields">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    <textarea
                        name="bio"
                        placeholder="Bio"
                        value={formData.bio}
                        onChange={handleChange}
                    />

                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                    />

                    <select
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                    >
                        <option value="Single">Single</option>
                        <option value="In a relationship">In a relationship</option>
                        <option value="Married">Married</option>
                    </select>

                    <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                {error && <div className="error">{error}</div>}

                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
