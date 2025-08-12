"use client";

import React, { useState, useEffect } from "react";
import {
    Settings,
    User,
    Shield,
    Bell,
    Save,
    RefreshCw,
    Check,
    X,
    Eye,
    EyeOff,
} from "lucide-react";
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";
import { cn } from "@client/lib/utils";

// Types for settings data
interface GeneralSettings {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    timezone: string;
    currency: string;
    language: string;
    dateFormat: string;
}

interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    systemAlerts: boolean;
    orderUpdates: boolean;
    inventoryAlerts: boolean;
    paymentReminders: boolean;
}

interface SecuritySettings {
    requireTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requirePasswordChange: boolean;
    passwordChangeInterval: number;
}

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<
        "general" | "profile" | "notifications" | "security"
    >("general");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [savedMessage, setSavedMessage] = useState("");

    // Settings state
    const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
        companyName: "Rental Management Co.",
        companyEmail: "admin@rental.com",
        companyPhone: "+1 (555) 123-4567",
        companyAddress: "123 Business Street, City, State 12345",
        timezone: "UTC-5",
        currency: "USD",
        language: "English",
        dateFormat: "MM/DD/YYYY",
    });

    const [notificationSettings, setNotificationSettings] =
        useState<NotificationSettings>({
            emailNotifications: true,
            smsNotifications: false,
            systemAlerts: true,
            orderUpdates: true,
            inventoryAlerts: true,
            paymentReminders: true,
        });

    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        requireTwoFactor: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requirePasswordChange: false,
        passwordChangeInterval: 90,
    });

    const [userProfile, setUserProfile] = useState<UserProfile>({
        firstName: "John",
        lastName: "Admin",
        email: "admin@rental.com",
        phone: "+1 (555) 123-4567",
        role: "Administrator",
        department: "IT",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Load settings on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                // Simulate API call - replace with actual API calls
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("Settings loaded successfully");
            } catch (error) {
                console.error("Failed to load settings:", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchSettings();
    }, []);

    // Save settings function
    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            // Simulate API call - replace with actual API calls
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSavedMessage("Settings saved successfully!");
            setTimeout(() => setSavedMessage(""), 3000);
            console.log("Settings saved:", {
                general: generalSettings,
                notifications: notificationSettings,
                security: securitySettings,
                profile: userProfile,
            });
        } catch (error) {
            console.error("Failed to save settings:", error);
            setSavedMessage("Failed to save settings. Please try again.");
            setTimeout(() => setSavedMessage(""), 3000);
        } finally {
            setSaving(false);
        }
    };

    // Reset to defaults
    const handleResetDefaults = () => {
        if (
            confirm(
                "Are you sure you want to reset all settings to defaults? This action cannot be undone.",
            )
        ) {
            // Reset all settings to default values
            setGeneralSettings({
                companyName: "Rental Management Co.",
                companyEmail: "admin@rental.com",
                companyPhone: "+1 (555) 123-4567",
                companyAddress: "123 Business Street, City, State 12345",
                timezone: "UTC-5",
                currency: "USD",
                language: "English",
                dateFormat: "MM/DD/YYYY",
            });
            setNotificationSettings({
                emailNotifications: true,
                smsNotifications: false,
                systemAlerts: true,
                orderUpdates: true,
                inventoryAlerts: true,
                paymentReminders: true,
            });
            setSecuritySettings({
                requireTwoFactor: false,
                sessionTimeout: 30,
                maxLoginAttempts: 5,
                passwordMinLength: 8,
                requirePasswordChange: false,
                passwordChangeInterval: 90,
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading settings...</div>
            </div>
        );
    }

    const tabs = [
        { id: "general", label: "General", icon: Settings },
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Settings
                    </h1>
                    <p className="text-gray-600">
                        Manage your application settings and preferences
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => void handleResetDefaults()}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reset Defaults
                    </Button>
                    <Button
                        onClick={() => void handleSaveSettings()}
                        disabled={saving}
                        className="flex items-center gap-2"
                    >
                        {saving ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {savedMessage && (
                <div
                    className={cn(
                        "px-4 py-3 rounded-lg border flex items-center gap-2",
                        savedMessage.includes("Failed")
                            ? "bg-red-50 border-red-200 text-red-800"
                            : "bg-green-50 border-green-200 text-green-800",
                    )}
                >
                    {savedMessage.includes("Failed") ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Check className="h-4 w-4" />
                    )}
                    {savedMessage}
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() =>
                                    setActiveTab(
                                        tab.id as
                                            | "general"
                                            | "profile"
                                            | "notifications"
                                            | "security",
                                    )
                                }
                                className={cn(
                                    "py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2",
                                    activeTab === tab.id
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {/* General Settings */}
                {activeTab === "general" && (
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Company Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="companyName">
                                        Company Name
                                    </Label>
                                    <Input
                                        id="companyName"
                                        value={generalSettings.companyName}
                                        onChange={(e) =>
                                            setGeneralSettings({
                                                ...generalSettings,
                                                companyName: e.target.value,
                                            })
                                        }
                                        placeholder="Enter company name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="companyEmail">
                                        Company Email
                                    </Label>
                                    <Input
                                        id="companyEmail"
                                        type="email"
                                        value={generalSettings.companyEmail}
                                        onChange={(e) =>
                                            setGeneralSettings({
                                                ...generalSettings,
                                                companyEmail: e.target.value,
                                            })
                                        }
                                        placeholder="Enter company email"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="companyPhone">
                                        Company Phone
                                    </Label>
                                    <Input
                                        id="companyPhone"
                                        value={generalSettings.companyPhone}
                                        onChange={(e) =>
                                            setGeneralSettings({
                                                ...generalSettings,
                                                companyPhone: e.target.value,
                                            })
                                        }
                                        placeholder="Enter company phone"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <select
                                        id="timezone"
                                        value={generalSettings.timezone}
                                        onChange={(e) =>
                                            setGeneralSettings({
                                                ...generalSettings,
                                                timezone: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="UTC-12">UTC-12</option>
                                        <option value="UTC-8">
                                            UTC-8 (PST)
                                        </option>
                                        <option value="UTC-5">
                                            UTC-5 (EST)
                                        </option>
                                        <option value="UTC+0">
                                            UTC+0 (GMT)
                                        </option>
                                        <option value="UTC+5:30">
                                            UTC+5:30 (IST)
                                        </option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="companyAddress">
                                        Company Address
                                    </Label>
                                    <textarea
                                        id="companyAddress"
                                        value={generalSettings.companyAddress}
                                        onChange={(e) =>
                                            setGeneralSettings({
                                                ...generalSettings,
                                                companyAddress: e.target.value,
                                            })
                                        }
                                        placeholder="Enter company address"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Localization
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="currency">Currency</Label>
                                    <select
                                        id="currency"
                                        value={generalSettings.currency}
                                        onChange={(e) =>
                                            setGeneralSettings({
                                                ...generalSettings,
                                                currency: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="INR">INR (₹)</option>
                                        <option value="JPY">JPY (¥)</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="language">Language</Label>
                                    <select
                                        id="language"
                                        value={generalSettings.language}
                                        onChange={(e) =>
                                            setGeneralSettings({
                                                ...generalSettings,
                                                language: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="English">English</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="French">French</option>
                                        <option value="German">German</option>
                                        <option value="Chinese">Chinese</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="dateFormat">
                                        Date Format
                                    </Label>
                                    <select
                                        id="dateFormat"
                                        value={generalSettings.dateFormat}
                                        onChange={(e) =>
                                            setGeneralSettings({
                                                ...generalSettings,
                                                dateFormat: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="MM/DD/YYYY">
                                            MM/DD/YYYY
                                        </option>
                                        <option value="DD/MM/YYYY">
                                            DD/MM/YYYY
                                        </option>
                                        <option value="YYYY-MM-DD">
                                            YYYY-MM-DD
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Profile */}
                {activeTab === "profile" && (
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        value={userProfile.firstName}
                                        onChange={(e) =>
                                            setUserProfile({
                                                ...userProfile,
                                                firstName: e.target.value,
                                            })
                                        }
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={userProfile.lastName}
                                        onChange={(e) =>
                                            setUserProfile({
                                                ...userProfile,
                                                lastName: e.target.value,
                                            })
                                        }
                                        placeholder="Enter last name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="profileEmail">Email</Label>
                                    <Input
                                        id="profileEmail"
                                        type="email"
                                        value={userProfile.email}
                                        onChange={(e) =>
                                            setUserProfile({
                                                ...userProfile,
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="profilePhone">Phone</Label>
                                    <Input
                                        id="profilePhone"
                                        value={userProfile.phone}
                                        onChange={(e) =>
                                            setUserProfile({
                                                ...userProfile,
                                                phone: e.target.value,
                                            })
                                        }
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="role">Role</Label>
                                    <Input
                                        id="role"
                                        value={userProfile.role}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="department">
                                        Department
                                    </Label>
                                    <Input
                                        id="department"
                                        value={userProfile.department}
                                        onChange={(e) =>
                                            setUserProfile({
                                                ...userProfile,
                                                department: e.target.value,
                                            })
                                        }
                                        placeholder="Enter department"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Change Password
                            </h3>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <Label htmlFor="currentPassword">
                                        Current Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={
                                                showPasswords.current
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={userProfile.currentPassword}
                                            onChange={(e) =>
                                                setUserProfile({
                                                    ...userProfile,
                                                    currentPassword:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswords({
                                                    ...showPasswords,
                                                    current:
                                                        !showPasswords.current,
                                                })
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.current ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="newPassword">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={
                                                showPasswords.new
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={userProfile.newPassword}
                                            onChange={(e) =>
                                                setUserProfile({
                                                    ...userProfile,
                                                    newPassword: e.target.value,
                                                })
                                            }
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswords({
                                                    ...showPasswords,
                                                    new: !showPasswords.new,
                                                })
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.new ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="confirmPassword">
                                        Confirm New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={
                                                showPasswords.confirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={userProfile.confirmPassword}
                                            onChange={(e) =>
                                                setUserProfile({
                                                    ...userProfile,
                                                    confirmPassword:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswords({
                                                    ...showPasswords,
                                                    confirm:
                                                        !showPasswords.confirm,
                                                })
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.confirm ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Notification Preferences
                        </h3>
                        <div className="space-y-4">
                            {(
                                Object.entries(notificationSettings) as [
                                    keyof NotificationSettings,
                                    boolean,
                                ][]
                            ).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <Label className="text-base">
                                            {key
                                                .replace(/([A-Z])/g, " $1")
                                                .replace(/^./, (str) =>
                                                    str.toUpperCase(),
                                                )}
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            {key === "emailNotifications" &&
                                                "Receive notifications via email"}
                                            {key === "smsNotifications" &&
                                                "Receive notifications via SMS"}
                                            {key === "systemAlerts" &&
                                                "Get alerts about system issues"}
                                            {key === "orderUpdates" &&
                                                "Get notified about order status changes"}
                                            {key === "inventoryAlerts" &&
                                                "Get alerts when inventory is low"}
                                            {key === "paymentReminders" &&
                                                "Get reminders for pending payments"}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={(e) =>
                                                setNotificationSettings({
                                                    ...notificationSettings,
                                                    [key]: e.target.checked,
                                                })
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Authentication
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">
                                            Two-Factor Authentication
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            Require two-factor authentication
                                            for all users
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={
                                                securitySettings.requireTwoFactor
                                            }
                                            onChange={(e) =>
                                                setSecuritySettings({
                                                    ...securitySettings,
                                                    requireTwoFactor:
                                                        e.target.checked,
                                                })
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="sessionTimeout">
                                            Session Timeout (minutes)
                                        </Label>
                                        <Input
                                            id="sessionTimeout"
                                            type="number"
                                            min="5"
                                            max="480"
                                            value={
                                                securitySettings.sessionTimeout
                                            }
                                            onChange={(e) =>
                                                setSecuritySettings({
                                                    ...securitySettings,
                                                    sessionTimeout:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 30,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="maxLoginAttempts">
                                            Max Login Attempts
                                        </Label>
                                        <Input
                                            id="maxLoginAttempts"
                                            type="number"
                                            min="3"
                                            max="10"
                                            value={
                                                securitySettings.maxLoginAttempts
                                            }
                                            onChange={(e) =>
                                                setSecuritySettings({
                                                    ...securitySettings,
                                                    maxLoginAttempts:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 5,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Password Policy
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="passwordMinLength">
                                            Minimum Password Length
                                        </Label>
                                        <Input
                                            id="passwordMinLength"
                                            type="number"
                                            min="6"
                                            max="32"
                                            value={
                                                securitySettings.passwordMinLength
                                            }
                                            onChange={(e) =>
                                                setSecuritySettings({
                                                    ...securitySettings,
                                                    passwordMinLength:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 8,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="passwordChangeInterval">
                                            Password Change Interval (days)
                                        </Label>
                                        <Input
                                            id="passwordChangeInterval"
                                            type="number"
                                            min="30"
                                            max="365"
                                            value={
                                                securitySettings.passwordChangeInterval
                                            }
                                            onChange={(e) =>
                                                setSecuritySettings({
                                                    ...securitySettings,
                                                    passwordChangeInterval:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 90,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">
                                            Require Regular Password Changes
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            Force users to change passwords
                                            periodically
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={
                                                securitySettings.requirePasswordChange
                                            }
                                            onChange={(e) =>
                                                setSecuritySettings({
                                                    ...securitySettings,
                                                    requirePasswordChange:
                                                        e.target.checked,
                                                })
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
