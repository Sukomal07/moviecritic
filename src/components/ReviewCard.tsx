import { FilePenLine, Trash2 } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Review {
    id: number;
    reviewer: string | null;
    rating: number;
    comment: string;
    setRefresh: (value: boolean) => void;
}

export default function ReviewCard({ id, comment, rating, reviewer, setRefresh }: Review) {
    const router = useRouter();
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        try {
            const response = await fetch(`/api/review/${id}`, {
                method: 'DELETE',
            });

            if (response.status === 200) {
                const data = await response.json();
                setRefresh(true)
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
        <div className='w-full p-4 border-2 border-gray-400 flex flex-col gap-6'>
            <div className='flex justify-between items-center'>
                <p className='text-xl font-medium'>{comment}</p>
                <p className='text-[#615CF2] text-2xl font-semibold'> {formatRating(rating)} / 10</p>
            </div>
            <div className='flex justify-between items-center'>
                <h1 className='text-xl font-semibold text-slate-600'>By {reviewer ? reviewer : " Anonymous"}</h1>
                <div className='ml-auto flex gap-5 items-center'>
                    <button onClick={() => router.push(`/review/update/${id}`)}>
                        <FilePenLine className='h-5 w-5 font-semibold text-[#798897]' />
                    </button>
                    <button onClick={(e) => handleDelete(e)}>
                        <Trash2 className='h-5 w-5 font-semibold text-[#798897]' />
                    </button>
                </div>
            </div>
        </div>
    )
}
