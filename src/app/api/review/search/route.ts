import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query') || '';
        const movieId = searchParams.get('movieId');

        if (!query || !movieId) {
            return NextResponse.json({ message: 'Query parameter or movieId is missing' }, { status: 400 });
        }


        const reviews = await prisma.review.findMany({
            where: {
                movieId: Number(movieId),
                OR: [
                    {
                        comment: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        reviewer: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            include: {
                movie: true,
            },
        });

        if (!reviews.length) {
            return NextResponse.json({ message: 'No reviews found' }, { status: 404 });
        }

        return NextResponse.json({ message: "all review", reviews }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error: error }, { status: 500 });
    }
}
