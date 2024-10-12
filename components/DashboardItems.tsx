"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

// Helper to create an array of 365 days with dummy activity
const getSubmissionActivity = () => {
  return Array(365).fill(false).map((_, i) => i % 45 === 0); // Active on every 45th day for demonstration
};

// Helper function to split days into months (for simplicity)
const getMonths = (activity: boolean[]) => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(activity.slice(i * 30, (i + 1) * 30)); // Roughly 30 days per month
  }
  return months;
};

const Dashboard: React.FC = () => {
  // Retrieve the social media links from local storage or set defaults
  const storedSocialLinks = localStorage.getItem('socialLinks');
  
  const [socialLinks, setSocialLinks] = useState(
    storedSocialLinks ? JSON.parse(storedSocialLinks) : {
      linkedin: '',
      twitter: '',
      github: '',
    }
  );

  const [isEditing, setIsEditing] = useState(false); // Toggle between edit and display mode

  const submissionActivity = getSubmissionActivity(); // Get the activity data
  const monthsActivity = getMonths(submissionActivity); // Split data into months

  // Function to handle input change for social links
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prevLinks:any) => ({ ...prevLinks, [name]: value }));
  };

  // Function to open the social media link in a new tab
  const handleSocialClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Function to toggle the editing mode
  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  // Save social links to local storage whenever they are updated
  useEffect(() => {
    localStorage.setItem('socialLinks', JSON.stringify(socialLinks));
  }, [socialLinks]);

  return (
    <div className="bg-white min-h-screen text-black p-6">
      {/* Top section with profile details */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src="/profile-pic.jpg"
            alt="Profile"
            className="w-20 h-20 rounded-full border border-gray-300"
          />
          <div>
            <h2 className="text-xl font-semibold">Harsh Vardhan</h2>
            <p className="text-gray-600">Rank: 2,534,405</p>
          </div>
        </div>
        <Button onClick={toggleEditing} variant="secondary">
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </Button>
      </div>

      {/* Stats Section */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        {/* Battles Won */}
        <div className="bg-gray-100 p-6 rounded-lg text-center border border-gray-300">
          <h3 className="text-lg font-medium">Battles Won</h3>
          <p className="text-3xl font-bold">23</p>
        </div>
        {/* Locked Badge */}
        <div className="bg-gray-100 p-6 rounded-lg text-center border border-gray-300">
          <h3 className="text-lg font-medium">Locked Badge</h3>
          <p className="text-sm text-gray-600">Oct LeetCoding Challenge</p>
        </div>
        {/* Submissions */}
        <div className="bg-gray-100 p-6 rounded-lg text-center border border-gray-300">
          <h3 className="text-lg font-medium">Submissions This Year</h3>
          <p className="text-3xl font-bold">37</p>
        </div>
      </div>

      {/* Submission History (Year Overview) */}
      <div className="mt-8 bg-gray-100 p-6 rounded-lg border border-gray-300">
        <h3 className="text-lg font-medium mb-4">Submission History</h3>
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Total active days: 8</p>
          <p className="text-sm text-gray-600">Max streak: 3</p>
        </div>

        {/* Display the submission activity with months */}
        <div className="grid grid-cols-12 gap-2 mt-2">
          {monthsActivity.map((month, index) => (
            <div key={index} className="space-y-1">
              {/* Month Activity */}
              <div className="grid grid-cols-5 gap-0.5">
                {month.map((active, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`h-3 w-3 rounded-sm ${
                      active ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                    title={`Day ${dayIndex + 1}: ${active ? 'Active' : 'Inactive'}`}
                  ></div>
                ))}
              </div>
              {/* Month Label */}
              <p className="text-xs text-gray-600 text-center">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-8 bg-gray-100 p-6 rounded-lg border border-gray-300">
        <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
        {/* Conditionally render inputs or buttons based on isEditing */}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={socialLinks.linkedin}
                onChange={handleInputChange}
                placeholder="Add your LinkedIn profile"
                className="w-full p-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Twitter</label>
              <input
                type="url"
                name="twitter"
                value={socialLinks.twitter}
                onChange={handleInputChange}
                placeholder="Add your Twitter profile"
                className="w-full p-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">GitHub</label>
              <input
                type="url"
                name="github"
                value={socialLinks.github}
                onChange={handleInputChange}
                placeholder="Add your GitHub profile"
                className="w-full p-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex space-x-4">
            {socialLinks.linkedin && (
              <Button
                onClick={() => handleSocialClick(socialLinks.linkedin)}
                variant="secondary"
              >
                LinkedIn
              </Button>
            )}
            {socialLinks.twitter && (
              <Button
                onClick={() => handleSocialClick(socialLinks.twitter)}
                variant="primary"
              >
                Twitter
              </Button>
            )}
            {socialLinks.github && (
              <Button
                onClick={() => handleSocialClick(socialLinks.github)}
                variant="super"
              >
                GitHub
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
