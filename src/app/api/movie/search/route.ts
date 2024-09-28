import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query') || '';

        if (!query) {
            return NextResponse.json({ message: 'Query parameter is missing' }, { status: 400 });
        }

        const movies = await prisma.movie.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
        });

        if (!movies.length) {
            return NextResponse.json({ message: 'No movies found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'All movies', movies }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error: error }, { status: 500 });
    }
}
