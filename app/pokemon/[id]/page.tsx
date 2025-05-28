import type { Metadata } from "next"
import PokemonDetail from "@/components/pokemon-detail"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PokemonPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PokemonPageProps): Promise<Metadata> {
  const id = params.id

  try {
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json())
    return {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | Pokémon Explorer`,
      description: `View details about ${pokemon.name}, including types, abilities, and stats.`,
    }
  } catch (error) {
    return {
      title: "Pokémon Details | Pokémon Explorer",
      description: "View detailed information about this Pokémon.",
    }
  }
}

export default function PokemonPage({ params }: PokemonPageProps) {
  const { id } = params

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
      </Link>

      <PokemonDetail id={id} />
    </div>
  )
}
