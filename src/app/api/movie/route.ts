import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Movie } from '@prisma/client';

interface MovieCreateInput {
    name: string;
    releaseDate: string;
}

export async function GET() {
    try {
        const movies = await prisma.movie.findMany({
            include: { reviews: true },
        });

        if (!movies.length) {
            return NextResponse.json({ message: "No movies found" }, { status: 404 })
        }

        const movieWithRatings = movies.map(movie => ({
            ...movie,
            averageRating:
                movie.reviews.length > 0
                    ? movie.reviews.reduce((acc, review) => acc + review.rating, 0) / movie.reviews.length
                    : null,
        }));

        return NextResponse.json({ message: "All movies", movieWithRatings }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error: error }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { name, releaseDate }: MovieCreateInput = await req.json();

        if (!name || !releaseDate) {
            return NextResponse.json({ message: 'Name and Release date required' }, { status: 400 })
        }

        const newMovie: Movie = await prisma.movie.create({
            data: {
                name,
                releaseDate: releaseDate,
            },
        });

        return NextResponse.json({ message: "movie created successfully", newMovie }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error: error }, { status: 500 });
    }
}
