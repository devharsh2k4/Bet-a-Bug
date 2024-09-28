"use client"

import { useEffect, useState } from 'react';

interface Job {
    id: string;
    title: string;
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
                const response = await fetch('https://jobs.github.com/positions.json?description=developer');
                const data: Job[] = await response.json();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Development Job Opportunities</h1>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <h2>{job.title}</h2>
                        <p>{job.company} - {job.location}</p>
                        <p>{job.description}</p>
                        <a href={job.url} target="_blank" rel="noopener noreferrer">Apply</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OpportunitiesPage;