import React, { useState } from 'react';
import { Switch, Button, Input, Form } from 'antd';
import { EditOutlined, TwitterOutlined, FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import MainLayout from './layouts/MainLayout';
import '../styles/Profile.scss';

interface UserProfile {
    fullName: string;
    email: string;
    mobile: string;
    location: string;
    bio: string;
    social: {
        twitter: string;
        facebook: string;
        instagram: string;
    }
}

const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        fullName: 'Sarah Emily Jacob',
        email: 'sarahjacob@mail.com',
        mobile: '(44) 123 1234 123',
        location: 'USA',
        bio: 'Hi, I\'m Sarah Jacob. CEO / Co-Founder',
        social: {
            twitter: 'https://twitter.com/sarahjacob',
            facebook: 'https://facebook.com/sarahjacob',
            instagram: 'https://instagram.com/sarahjacob'
        }
    });

    const handleNotificationChange = (checked: boolean, type: string) => {
        console.log(`${type} notification changed to ${checked}`);
    };

    const handleSaveProfile = (values: any) => {
        setProfile({ ...profile, ...values });
        setIsEditing(false);
    };

    return (
        <MainLayout>
            <div className="profile-page">
                <div className="heading-page">
                    <h5>Tài khoản</h5>
                </div>
                <div className="profile-content">
                    <div className="settings-section">
                        <div className="section-card">
                            <h2>Platform Settings</h2>
                            <div className="settings-group">
                                <h3>ACCOUNT</h3>
                                <div className="setting-item">
                                    <Switch 
                                        defaultChecked 
                                        onChange={(checked) => handleNotificationChange(checked, 'follow')}
                                    />
                                    <span>Email me when someone follows me</span>
                                </div>
                                <div className="setting-item">
                                    <Switch 
                                        onChange={(checked) => handleNotificationChange(checked, 'answer')}
                                    />
                                    <span>Email me when someone answers me</span>
                                </div>
                                <div className="setting-item">
                                    <Switch 
                                        defaultChecked
                                        onChange={(checked) => handleNotificationChange(checked, 'mention')}
                                    />
                                    <span>Email me when someone mentions me</span>
                                </div>
                            </div>
                            <div className="settings-group">
                                <h3>APPLICATION</h3>
                                <div className="setting-item">
                                    <Switch 
                                        defaultChecked
                                        onChange={(checked) => handleNotificationChange(checked, 'launches')}
                                    />
                                    <span>New launches and projects</span>
                                </div>
                                <div className="setting-item">
                                    <Switch 
                                        defaultChecked
                                        onChange={(checked) => handleNotificationChange(checked, 'updates')}
                                    />
                                    <span>Monthly product updates</span>
                                </div>
                                <div className="setting-item">
                                    <Switch 
                                        defaultChecked
                                        onChange={(checked) => handleNotificationChange(checked, 'newsletter')}
                                    />
                                    <span>Subscribe to newsletter</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <div className="section-card">
                            <div className="card-header">
                                <h2>Profile Information</h2>
                                <Button 
                                    type="text" 
                                    icon={<EditOutlined />}
                                    onClick={() => setIsEditing(!isEditing)}
                                />
                            </div>
                            
                            {isEditing ? (
                                <Form
                                    initialValues={profile}
                                    onFinish={handleSaveProfile}
                                    layout="vertical"
                                >
                                    <Form.Item name="fullName" label="Full Name">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="email" label="Email">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="mobile" label="Mobile">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="location" label="Location">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="bio" label="Bio">
                                        <Input.TextArea rows={4} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Save Changes
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ) : (
                                <div className="profile-details">
                                    <div className="user-info">
                                        <div className="avatar">
                                            {profile.fullName.charAt(0)}
                                        </div>
                                        <div className="info">
                                            <h3>{profile.fullName}</h3>
                                            <p className="role">{profile.bio}</p>
                                        </div>
                                    </div>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Full Name:</label>
                                            <span>{profile.fullName}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Mobile:</label>
                                            <span>{profile.mobile}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Email:</label>
                                            <span>{profile.email}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Location:</label>
                                            <span>{profile.location}</span>
                                        </div>
                                        <div className="info-item social">
                                            <label>Social:</label>
                                            <div className="social-links">
                                                <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
                                                    <TwitterOutlined />
                                                </a>
                                                <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer">
                                                    <FacebookOutlined />
                                                </a>
                                                <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer">
                                                    <InstagramOutlined />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Profile; 