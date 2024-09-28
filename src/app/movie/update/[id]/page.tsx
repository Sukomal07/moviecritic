'use client'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation';

export default function Page() {
    const [name, setName] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/movie/${id}`);
                const data = await response.json();
                if (response.status === 200) {
                    setName(data.movie?.name);
                    setReleaseDate(data?.movie?.releaseDate);
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

    const updateMovie = async () => {
        if (!name || !releaseDate) {
            toast.error("Please fill in all fields");
            return;
        }

        const movie = {
            name,
            releaseDate,
        };

        try {
            const response = await fetch(`/api/movie/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movie),
            });

            const data = await response.json();
            toast.success(data?.message);
            if (response.status === 200) {
                router.push('/')
            }
            setName('');
            setReleaseDate('');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    };

    return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <div className='w-[350px] px-8 py-10 border-2 border-gray-400 flex flex-col gap-6'>
                <h1 className='text-2xl font-semibold'>Update movie</h1>
                <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} className="w-full h-full border-2 border-gray-400 px-2 py-2 rounded-md outline-none font-normal bg-transparent" />
                <input type="text" placeholder='Release Date' value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className="w-full h-full border-2 border-gray-400 px-2 py-2 rounded-md outline-none font-normal bg-transparent" />
                <button onClick={updateMovie} disabled={!name || !releaseDate} className='bg-[#615CF2] ml-auto text-white px-5 py-2 rounded-md font-semibold'>Update movie</button>
            </div>
        </div>
    )
}
