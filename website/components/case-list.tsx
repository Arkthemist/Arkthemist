import { Case } from "@/types/case"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface CaseListProps {
  cases: Case[]
}

export function CaseList({ cases }: CaseListProps) {
  return (
    <ScrollArea className="h-[300px] w-full">
      <div className="space-y-2">
        {cases.map((case_) => (
          <div
            key={case_.id}
            className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <Link href={`/chat?roomId=${case_.roomId}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white">{case_.title}</h3>
                <Badge
                  variant="outline"
                  className={
                    case_.priority === 'high'
                      ? 'border-red-500 text-red-500'
                      : case_.priority === 'medium'
                        ? 'border-yellow-500 text-yellow-500'
                        : 'border-green-500 text-green-500'
                  }
                >
                  {case_.priority}
                </Badge>
              </div>
              <p className="text-sm text-zinc-400 mt-1">
                Created: {new Date(case_.dateCreated).toLocaleDateString()}
              </p>
            </Link>
          </div>

        ))}
      </div>
    </ScrollArea>
  )
}

