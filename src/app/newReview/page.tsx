'use client'
import { Movie } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<string>('');
    const [reviewer, setReviewer] = useState<string>('');
    const [rating, setRating] = useState<number>();
    const [comment, setComment] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/movie');
                const data = await response.json();
                if (response.status === 200) {
                    setMovies(data.movieWithRatings);
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    console.error('An unknown error occurred');
                }
            }
        }
        fetchData();
    }, [])

    const handleSubmit = async () => {
        if (!selectedMovie || !rating || rating < 1 || rating > 10 || !comment) {
            toast.error('Please fill out all fields with valid information');
            return;
        }

        const postData = {
            movieId: parseInt(selectedMovie),
            rating: rating,
            comment: comment,
            reviewer: reviewer,
        };

        try {
            const response = await fetch('/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 201) {
                router.push(`/movie/${selectedMovie}`)
            }

            const data = await response.json();

            toast.success(data?.message)
            setSelectedMovie('');
            setReviewer('');
            setComment('');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        }
    };

    return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <div className='w-[300px] md:w-[400px] px-8 py-10 border-2 border-gray-400 flex flex-col gap-6'>
                <h1 className='text-2xl font-semibold'>Add new review</h1>
                <select name="movie" id="movie" value={selectedMovie}
                    onChange={(e) => setSelectedMovie(e.target.value)} className="w-full h-full border-2 border-gray-400 px-2 py-2 rounded-md outline-none font-normal bg-transparent cursor-pointer">
                    <option value="">Select a movie</option>
                    {movies.map((movie) => (
                        <option key={movie?.id} value={movie?.id}>{movie?.name}</option>
                    ))}
                </select>
                <input type="text" placeholder='Your name' value={reviewer}
                    onChange={(e) => setReviewer(e.target.value)} className="w-full h-full border-2 border-gray-400 px-2 py-2 rounded-md outline-none font-normal bg-transparent" />
                <input type="number" placeholder='Rating out of 10' value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full h-full border-2 border-gray-400 px-2 py-2 rounded-md outline-none font-normal bg-transparent" />
                <textarea rows={5} placeholder='Review comments' value={comment}
                    onChange={(e) => setComment(e.target.value)} className="w-full h-full border-2 border-gray-400 px-2 py-2 rounded-md outline-none font-normal bg-transparent resize-none" ></textarea>
                <button onClick={handleSubmit} disabled={!selectedMovie || !rating || !comment} className='bg-[#615CF2] ml-auto text-white px-5 py-2 rounded-md font-semibold'>Add review</button>
            </div>
        </div>
    )
}
