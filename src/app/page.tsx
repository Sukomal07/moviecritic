'use client'
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import { Search } from "lucide-react"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Movie } from "@prisma/client";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const router = useRouter();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery.trim() === "") {
      const allMovies = async function fetchData() {
        try {
          const response = await fetch('/api/movie');
          const data = await response.json();
          if (response.status === 200) {
            setMovies(data.movieWithRatings);
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            console.error('An unknown error occurred');
          }
        }
      }
      allMovies();
    } else {
      const queryMovies = async function searchMovies() {
        try {
          const response = await fetch(`/api/movie/search?query=${debouncedSearchQuery}`);
          const data = await response.json();
          if (response.status === 200) {
            setMovies(data.movies);
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            console.error('An unknown error occurred');
          }
        }
      }
      queryMovies();
    }
  }, [debouncedSearchQuery, refresh]);
  return (
    <main>
      <Navbar />
      <h1 className="text-2xl md:text-4xl px-8 py-8">The best movie reviews site!</h1>
      <div className="px-8 pb-8">
        <div className="flex gap-3 px-2 border-2 border-[#615CF2] rounded-md max-w-96 h-12 items-center">
          <Search className="h-5 w-5 text-slate-400 bg-transparent" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for your favourite movie" className="w-full h-full border-none outline-none text-xl font-normal bg-transparent" />
        </div>
      </div>
      <section className="px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-12">
        {
          movies && movies.length > 0 ? (
            movies.map((movie: Movie) => (
              <div key={movie?.id} onClick={() => router.push(`/movie/${movie?.id}`)}>
                <MovieCard id={movie?.id} movieName={movie?.name} releaseDate={movie?.releaseDate} rating={movie?.averageRating} setRefresh={setRefresh} />
              </div>
            ))
          ) : (
            <p className='text-xl text-gray-500'>No movies found</p>
          )
        }
      </section>
      <div className='md:hidden items-center flex fixed bottom-0 w-full h-16 bg-gray- px-4 justify-between'>
        <button className='bg-white text-[#615CF2] px-5 py-2 rounded-md border-2 border-[#9289F8] font-semibold' onClick={() => router.push('/newMovie')}>Add new movie</button>
        <button className='bg-[#615CF2] text-white px-5 py-2 rounded-md font-semibold' onClick={() => router.push('/newReview')}>Add new review</button>
      </div>
    </main>
  );
}
