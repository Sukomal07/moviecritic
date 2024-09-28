import { NextResponse } from 'next/server';
import { Review } from '@prisma/client';
import prisma from '@/lib/prisma';

interface ReviewUpdateInput {
    reviewer?: string;
    rating: number;
    comment: string;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const { reviewer, rating, comment }: ReviewUpdateInput = await req.json();

        if (!rating || !comment) {
            return NextResponse.json({ message: "Rating and comment is required" }, { status: 400 })
        }
        if (rating > 10) {
            return NextResponse.json({ message: "Max rating is 10" }, { status: 400 });
        }

        const updatedReview: Review = await prisma.review.update({
            where: { id: Number(id) },
            data: {
                ...(reviewer && { reviewer }),
                ...(rating && { rating: parseFloat(rating.toString()) }),
                ...(comment && { comment }),
            },
        });

        if (!updatedReview) {
            return NextResponse.json({ message: "Review not found" }, { status: 404 })
        }

        const reviews = await prisma.review.findMany({
            where: { movieId: updatedReview.movieId },
        });
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

        await prisma.movie.update({
            where: { id: updatedReview.movieId },
            data: {
                averageRating,
            },
        });

        return NextResponse.json({ message: 'Movie updated successfully', updatedReview }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to update review', error: error }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const reviewToDelete: Review = await prisma.review.delete({
            where: { id: Number(id) },
        });

        if (!reviewToDelete) {
            return NextResponse.json({ message: "Review not found" }, { status: 404 })
        }

        const reviews = await prisma.review.findMany({
            where: { movieId: reviewToDelete.movieId },
        });
        const averageRating = reviews.length
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
            : 0;

        await prisma.movie.update({
            where: { id: reviewToDelete.movieId },
            data: {
                averageRating,
            },
        });

        return NextResponse.json({ message: 'Review deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete review', error: error }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const review = await prisma.review.findUnique({
            where: { id: Number(id) },
            include: {
                movie: true
            }
        });

        if (!review) {
            return NextResponse.json({ message: "Review not found" }, { status: 404 })
        }

        return NextResponse.json({ message: 'Review fetch successfully', review }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to get review', error: error }, { status: 500 });
    }
}
