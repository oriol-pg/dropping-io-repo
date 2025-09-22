import { DropPage } from "@/components/drop/drop-page"
import { mockDrop } from "@/lib/mock-data"

export default function Home() {
  return <DropPage drop={mockDrop} />
}
