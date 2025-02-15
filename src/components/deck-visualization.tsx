import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function DeckVisualization() {
  return (
    <div className="p-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="default" size="sm">
          On deck
        </Button>
        <Button variant="ghost" size="sm">
          Off deck
        </Button>
      </div>

      <div className="bg-white rounded-lg p-8 border">
        <div className="relative w-full aspect-square max-w-2xl mx-auto">
          <Image
            src="/placeholder.png"
            alt="Deck visualization"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4 text-sm text-muted-foreground">
        <span>Double-click to edit</span>
        <span>Shift + click to select range</span>
        <span>Command + click to select multiple</span>
      </div>
    </div>
  );
}
