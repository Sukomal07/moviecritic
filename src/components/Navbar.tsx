'use client'

import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const router = useRouter();
    return (
        <div className='flex justify-between items-center p-5 bg-gray-300'>
            <Link href={'/'} className='text-slate-700 font-bold'>MOVIECRITIC</Link>
            <div className='md:flex gap-4 items-center hidden'>
                <button className='bg-white text-[#615CF2] px-5 py-2 rounded-md border-2 border-[#9289F8] font-semibold' onClick={() => router.push('/newMovie')}>Add new movie</button>
                <button className='bg-[#615CF2] text-white px-5 py-2 rounded-md font-semibold' onClick={() => router.push('/newReview')}>Add new review</button>
            </div>
        </div>
    )
}
