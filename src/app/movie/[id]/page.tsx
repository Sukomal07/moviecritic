'use client'
import Navbar from '@/components/Navbar'
import ReviewCard from '@/components/ReviewCard'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Review } from '@prisma/client'
import { Search } from 'lucide-react'
import useDebounce from '@/hooks/useDebounce'

interface Movie {
    id: number;
    name: string;
    releaseDate: string;
    averageRating: number | null;
    reviews: Review[]
}
export default function Page() {
    const { id } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [refresh, setRefresh] = useState<boolean>(false);
    const router = useRouter();

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    function formatRating(rating: number | null | undefined) {
        if (!rating) return '0';
        const formattedRating = parseFloat(rating.toFixed(2));
        return formattedRating.toString();
    }

    useEffect(() => {
        if (debouncedSearchQuery.trim() === "") {
            const fetchData = async () => {
                try {
                    const response = await fetch(`/api/movie/${id}`);
                    const data = await response.json();
                    if (response.status === 200) {
                        setMovie(data.movie);
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
        } else {
            const searchReviews = async () => {
                try {
                    const response = await fetch(`/api/review/search?query=${debouncedSearchQuery}&movieId=${movie?.id}`);
                    const data = await response.json();
                    if (response.status === 200 && movie) {
                        setMovie({
                            ...movie,
                            reviews: data.reviews
                        });
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        toast.error(error.message);
                    } else {
                        console.error('An unknown error occurred');
                    }
                }
            };

            searchReviews();
        }
    }, [debouncedSearchQuery, refresh, id]);
    return (
        <main>
            <Navbar />

            <div className="px-8 py-8">
                <div className="flex gap-3 px-2 border-2 border-[#615CF2] rounded-md max-w-96 h-12 items-center">
                    <Search className="h-5 w-5 text-slate-400 bg-transparent" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for your review" className="w-full h-full border-none outline-none text-xl font-normal bg-transparent" />
                </div>
            </div>
            <div className='px-8 py-6 flex items-center justify-between'>
                <h1 className='text-3xl font-semibold capitalize'>{movie?.name}</h1>
                <h1 className='text-4xl font-medium text-[#615CF2] pr-4'>{formatRating(movie?.averageRating)} /10</h1>
            </div>
            <section className='px-8 mt-6 pb-12 flex flex-col gap-5 mb-16'>
                {
                    movie && movie.reviews.length > 0 ? (
                        movie.reviews.map((review: Review) => (
                            <ReviewCard
                                key={review?.id}
                                id={review?.id}
                                comment={review?.comment}
                                rating={review?.rating}
                                reviewer={review?.reviewer}
                                setRefresh={setRefresh}
                            />
                        ))
                    ) : (
                        <p className='text-xl text-gray-500'>No reviews found</p>
                    )
                }
            </section>
            <div className='md:hidden items-center flex fixed bottom-0 w-full h-16 bg-gray- px-4 justify-between'>
                <button className='bg-white text-[#615CF2] px-5 py-2 rounded-md border-2 border-[#9289F8] font-semibold' onClick={() => router.push('/newMovie')}>Add new movie</button>
                <button className='bg-[#615CF2] text-white px-5 py-2 rounded-md font-semibold' onClick={() => router.push('/newReview')}>Add new review</button>
            </div>
        </main>
    )
}
