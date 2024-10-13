"use client";

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface Job {
    id: number;
    position: string;
    company: string;
    location: string;
    description: string;
    url: string;
}

const ITEMS_PER_PAGE = 9; 

const OpportunitiesPage = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1); 

    useEffect(() => {
        const fetchJobs = async () => {
            try {
            const response = await fetch('https://remoteok.com/api');
            const data = await response.json();

            const jobListings: Job[] = Array.isArray(data) && data.length > 1 ? data.slice(1).map((job) => {
                if (job.id && job.position && job.company && job.description && job.url) {
                return {
                    id: job.id,
                    position: job.position,
                    company: job.company,
                    location: job.location || 'Remote',
                    description: job.description,
                    url: job.url,
                };
                } else {
                console.warn('Invalid job data:', job);
                return null;
                }
            }).filter((job): job is Job => job !== null) : [];

            setJobs(jobListings);
            } catch (error) {
            console.error('Error fetching jobs:', error);
            } finally {
            setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    
    const handleApplyClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

   
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);

    
    const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);

    
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

   
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
                    {currentJobs.map((job) => (
                        <div
                            key={job.id}
                            className=" shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{job.position}</h2>
                            <p className="text-gray-600 text-sm mb-2">{job.company}</p>
                            <p className="text-gray-500 text-sm mb-4">
                                <span className="font-semibold">Location:</span> {job.location}
                            </p>
                            <Button
                                onClick={() => handleApplyClick(job.url)}
                                variant="primary"
                            >
                                Apply Now
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-10 space-x-2">
                    {/* Previous Button */}
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        variant="secondary"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            variant={currentPage === index + 1 ? "primary" : "secondary"}
                        >
                            {index + 1}
                        </Button>
                    ))}

                    {/* Next Button */}
                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        variant="secondary"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OpportunitiesPage;
