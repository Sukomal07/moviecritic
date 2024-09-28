import React from 'react'
import { FilePenLine, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface CardProps {
    id: number
    movieName: string
    releaseDate: string
    rating: number | null
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MovieCard({ id, movieName, releaseDate, rating, setRefresh }: CardProps) {

    const router = useRouter();
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        try {
            const response = await fetch(`/api/movie/${id}`, {
                method: 'DELETE',
            });

            if (response.status === 200) {
                const data = await response.json();
                setRefresh((prev: boolean) => !prev);
                toast.success(data?.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        }
    };

    function formatRating(rating: number | null | undefined) {
        if (!rating) return '0';
        const formattedRating = parseFloat(rating.toFixed(2));
        return formattedRating.toString();
    }
    return (
        <div className='bg-[#E0DFFC] w-full h-full p-6 flex flex-col cursor-pointer'>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl font-bold capitalize break-words'>{movieName}</h1>
                <p className='italic capitalize break-words text-[#566172]'>Released: {releaseDate}</p>
                <p className='font-bold capitalize'>Rating: {formatRating(rating)} / 10</p>
            </div>
            <div className='ml-auto flex gap-5 items-center'>
                <button onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/movie/update/${id}`)
                }}>
                    <FilePenLine className='h-5 w-5 font-semibold text-[#798897]' />
                </button>
                <button onClick={(e) => handleDelete(e)}>
                    <Trash2 className='h-5 w-5 font-semibold text-[#798897]' />
                </button>
            </div>
        </div>
    )
}
