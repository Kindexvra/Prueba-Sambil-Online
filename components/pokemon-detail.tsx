"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import StatBar from "@/components/stat-bar"

interface PokemonDetailProps {
  id: string
}

interface PokemonData {
  id: number
  name: string
  sprites: {
    front_default: string
    back_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  types: {
    type: {
      name: string
    }
  }[]
  abilities: {
    ability: {
      name: string
    }
    is_hidden: boolean
  }[]
  stats: {
    base_stat: number
    stat: {
      name: string
    }
  }[]
  height: number
  weight: number
}

export default function PokemonDetail({ id }: PokemonDetailProps) {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)

        if (!response.ok) {
          throw new Error("Pokémon not found")
        }

        const data = await response.json()
        setPokemon(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch Pokémon details")
        console.error("Error fetching Pokémon details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemonDetail()
  }, [id])

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive">{error}</p>
          <p className="mt-2">Please try another Pokémon or go back to the list.</p>
        </CardContent>
      </Card>
    )
  }

  const formatStatName = (name: string): string => {
    switch (name) {
      case "hp":
        return "HP"
      case "attack":
        return "Attack"
      case "defense":
        return "Defense"
      case "special-attack":
        return "Sp. Atk"
      case "special-defense":
        return "Sp. Def"
      case "speed":
        return "Speed"
      default:
        return name.charAt(0).toUpperCase() + name.slice(1)
    }
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-6">
      {loading ? (
        <>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Skeleton className="h-48 w-48 rounded-md mb-4" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : pokemon ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="capitalize text-2xl">{pokemon.name}</span>
                <span className="text-lg text-muted-foreground">#{pokemon.id.toString().padStart(3, "0")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Tabs defaultValue="front" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="front">Front</TabsTrigger>
                  <TabsTrigger value="back">Back</TabsTrigger>
                </TabsList>
                <TabsContent value="front" className="flex justify-center py-4">
                  <div className="relative h-48 w-48">
                    <Image
                      src={pokemon.sprites.front_default || "/placeholder.svg"}
                      alt={`${pokemon.name} front view`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="back" className="flex justify-center py-4">
                  <div className="relative h-48 w-48">
                    <Image
                      src={pokemon.sprites.back_default || "/placeholder.svg"}
                      alt={`${pokemon.name} back view`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4 space-y-4 w-full">
                <div>
                  <h3 className="text-sm font-medium mb-2">Types</h3>
                  <div className="flex gap-2">
                    {pokemon.types.map(({ type }) => (
                      <Badge key={type.name} className={`type-${type.name} text-white capitalize`}>
                        {type.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Abilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map(({ ability, is_hidden }) => (
                      <Badge key={ability.name} variant={is_hidden ? "outline" : "secondary"} className="capitalize">
                        {ability.name.replace("-", " ")}
                        {is_hidden && " (Hidden)"}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Height</h3>
                    <p>{(pokemon.height / 10).toFixed(1)} m</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Weight</h3>
                    <p>{(pokemon.weight / 10).toFixed(1)} kg</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Base Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pokemon.stats.map(({ base_stat, stat }) => (
                  <StatBar key={stat.name} label={formatStatName(stat.name)} value={base_stat} maxValue={255} />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}
