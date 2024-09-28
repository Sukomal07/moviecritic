import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Movie } from '@prisma/client';

interface MovieUpdateInput {
    name?: string;
    releaseDate?: string;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const { name, releaseDate }: MovieUpdateInput = await req.json();

        if (!id) {
            return NextResponse.json({ message: 'Movie id is required' }, { status: 400 })
        }
        if (!name || !releaseDate) {
            return NextResponse.json({ message: 'Name and Release date required' }, { status: 400 })
        }

        const updatedMovie: Movie = await prisma.movie.update({
            where: { id: Number(id) },
            data: {
                ...(name && { name }),
                ...(releaseDate && { releaseDate: releaseDate }),
            },
        });

        if (!updatedMovie) {
            return NextResponse.json({ message: 'Movie not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Movie updated successfully', updatedMovie }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to update movie', error: error }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {

        if (!id) {
            return NextResponse.json({ message: 'Movie id is required' }, { status: 400 })
        }

        const deletedMovie = await prisma.movie.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!deletedMovie) {
            return NextResponse.json({ message: 'Movie not found' }, { status: 404 })
        }

        await prisma.review.deleteMany({
            where: { movieId: Number(id) },
        });

        await prisma.movie.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: 'Movie deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete movie', error: error }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {

        if (!id) {
            return NextResponse.json({ message: 'Movie id is required' }, { status: 400 })
        }

        const movie = await prisma.movie.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                reviews: true
            }
        })

        if (!movie) {
            return NextResponse.json({ message: 'Movie not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Movie get successfully', movie }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch movie', error: error }, { status: 500 });
    }
}
