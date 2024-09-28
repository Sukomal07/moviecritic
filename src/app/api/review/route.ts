import { NextResponse } from 'next/server';
import { Review } from '@prisma/client';
import prisma from '@/lib/prisma';

interface ReviewCreateInput {
    movieId: string;
    reviewer?: string;
    rating: number;
    comment: string;
}

export async function POST(req: Request) {
    try {
        const { movieId, reviewer, rating, comment }: ReviewCreateInput = await req.json();

        if (!movieId || !rating || !comment) {
            return NextResponse.json({ message: 'Movie id , rating and comment required' }, { status: 400 });
        }

        if (rating > 10) {
            return NextResponse.json({ message: "Max rating is 10" }, { status: 400 });
        }

        const movie = await prisma.movie.findUnique({
            where: {
                id: Number(movieId)
            }
        })

        if (!movie) {
            return NextResponse.json({ message: "Movie not found" }, { status: 404 })
        }

        const newReview: Review = await prisma.review.create({
            data: {
                movieId: Number(movieId),
                reviewer,
                rating: parseFloat(rating.toString()),
                comment,
            },
        });


        const reviews = await prisma.review.findMany({
            where: { movieId: Number(movieId) },
        });
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

        await prisma.movie.update({
            where: { id: Number(movieId) },
            data: {
                averageRating,
            },
        });

        return NextResponse.json({ message: 'review added successfully', newReview }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to add review', error: error }, { status: 500 });
    }
}
