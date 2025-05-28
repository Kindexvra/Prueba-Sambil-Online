"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Pokemon {
  name: string
  url: string
  id: number
  image: string
}

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const limit = 20

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true)
      try {
        const offset = (currentPage - 1) * limit
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
        const data = await response.json()

        // Calculate total pages
        setTotalPages(Math.ceil(data.count / limit))

        // Enhance the data with IDs and image URLs
        const enhancedPokemon = data.results.map((pokemon: { name: string; url: string }) => {
          const urlParts = pokemon.url.split("/")
          const id = Number.parseInt(urlParts[urlParts.length - 2])
          return {
            ...pokemon,
            id,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          }
        })

        setPokemon(enhancedPokemon)
      } catch (error) {
        console.error("Error fetching Pokémon:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [currentPage])

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index} className="p-4 flex flex-col items-center">
              <Skeleton className="h-24 w-24 rounded-md mb-4" />
              <Skeleton className="h-4 w-24" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pokemon.map((poke) => (
            <Link href={`/pokemon/${poke.id}`} key={poke.id}>
              <Card className="p-4 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
                <div className="relative h-32 w-32">
                  <Image
                    src={poke.image || "/placeholder.svg"}
                    alt={poke.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                  />
                </div>
                <h2 className="mt-2 text-lg font-medium capitalize">{poke.name}</h2>
                <p className="text-sm text-muted-foreground">#{poke.id.toString().padStart(3, "0")}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button variant="outline" onClick={handlePrevious} disabled={currentPage === 1 || loading}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>

        <div className="flex gap-1">
          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page)}
              disabled={loading}
              className="w-10"
            >
              {page}
            </Button>
          ))}
        </div>

        <Button variant="outline" onClick={handleNext} disabled={currentPage === totalPages || loading}>
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}
