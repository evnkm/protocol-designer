import { useState } from "react";
import { Droplet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiquidStore } from "@/store/liquidStore";
import LiquidDefinitionModal from "./LiquidDefinitionModal";

export default function LiquidSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const liquids = useLiquidStore((state) => state.liquids);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Droplet className="h-4 w-4" />
        Liquid
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
            {liquids.length > 0 ? (
              <div className="py-1">
                {liquids.map((liquid) => (
                  <button
                    key={liquid.id}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                    onClick={() => {
                      // Handle liquid selection
                      setIsOpen(false);
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: liquid.color }}
                    />
                    {liquid.name}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="border-t">
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                onClick={() => {
                  setShowModal(true);
                  setIsOpen(false);
                }}
              >
                <Plus className="h-4 w-4" />
                Define a liquid
              </button>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <LiquidDefinitionModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
