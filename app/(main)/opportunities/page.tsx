"use client";

import { useEffect, useState } from 'react';

interface Job {
    id: number;
    position: string;
    company: string;
    location: string;
    description: string;
    url: string;
}

const OpportunitiesPage = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('https://remoteok.com/api');
                const data = await response.json();

                const jobListings: Job[] = data.slice(1).map((job: any) => ({
                    id: job.id,
                    position: job.position,
                    company: job.company,
                    location: job.location || 'Remote',
                    description: job.description,
                    url: job.url,
                }));

                setJobs(jobListings);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-gray-600">Loading job listings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-5">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
                    Remote Development Job Opportunities
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{job.position}</h2>
                            <p className="text-gray-600 text-sm mb-2">{job.company}</p>
                            <p className="text-gray-500 text-sm mb-4">
                                <span className="font-semibold">Location:</span> {job.location}
                            </p>
                        
                            <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                            >
                                Apply Now
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OpportunitiesPage;
