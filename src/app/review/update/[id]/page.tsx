'use client'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { Movie } from '@prisma/client';

export default function Page() {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [reviewer, setReviewer] = useState<string>('');
    const [rating, setRating] = useState<string | number>('');
    const [comment, setComment] = useState<string>('');
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/review/${id}`);
                const data = await response.json();
                if (response.status === 200) {
                    setMovie(data?.review?.movie)
                    setReviewer(data?.review?.reviewer)
                    setRating(data?.review?.rating)
                    setComment(data?.review?.comment)
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    console.error('An unknown error occurred');
                }
            }
        };
        fetchData();
    }, [])


    const handleUpdate = async () => {
        const parsedRating = Number(rating);
        if (!parsedRating || parsedRating < 1 || parsedRating > 10 || !comment) {
            toast.error('Please fill out all fields with valid information');
            return;
        }

        const postData = {
            rating: rating,
            comment: comment,
            reviewer: reviewer,
        };

        try {
            const response = await fetch(`/api/review/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 200) {
                router.push(`/movie/${movie?.id}`)
            }

            const data = await response.json();

            toast.success(data?.message)
            setMovie(null);
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
            <div className='w-[400px] px-8 py-10 border-2 border-gray-400 flex flex-col gap-6'>
                <h1 className='text-2xl font-semibold'>Update review</h1>
                <select name="movie" id="movie" className="w-full h-full border-2 border-gray-400 px-2 py-2 rounded-md outline-none font-normal bg-transparent" disabled>
                    <option value="">{movie?.name}</option>
                </select>
                <input type="text" placeholder='Your name' value={reviewer}
                    onChange={(e) => setReviewer(e.target.value)} className="w-full h-full border-2 border-gray-400 px-2 py-2 rounded-md outline-none font-normal bg-transparent" />
                <input type="number" placeholder='Rating out of 10' value={rating} onChange={(e) => setRating(e.target.value)} className="w-full h-full border-2 border-gray-400 px-2 py-2 rounded-md outline-none font-normal bg-transparent" />
                <textarea rows={5} placeholder='Review comments' value={comment}
                    onChange={(e) => setComment(e.target.value)} className="w-full h-full border-2 border-gray-400 px-2 py-2 rounded-md outline-none font-normal bg-transparent resize-none" ></textarea>
                <button onClick={handleUpdate} disabled={!id || !rating || !comment} className='bg-[#615CF2] ml-auto text-white px-5 py-2 rounded-md font-semibold'>Update review</button>
            </div>
        </div>
    )
}
