"use client"

import { forwardRef } from "react"
import { IconSearch, IconX, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  isLoading: boolean
  placeholder?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ value, onChange, isLoading, placeholder }, ref) {
    return (
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          {isLoading ? (
            <IconLoader2
              size={18}
              className="animate-spin text-primary motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : (
            <IconSearch
              size={18}
              className="text-muted-foreground transition-colors duration-150 group-focus-within:text-primary"
              aria-hidden="true"
            />
          )}
        </div>
        <input
          ref={ref}
          type="text"
          name="station-search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Search for a station"}
          autoComplete="off"
          spellCheck={false}
          aria-label="Search stations"
          className={cn(
            "h-14 w-full rounded-md border border-border bg-card pl-11 pr-11",
            "text-sm tracking-wide placeholder:text-muted-foreground/50",
            "outline-none transition-colors duration-150",
            "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20",
            "hover:border-muted-foreground/30",
            "touch-manipulation",
          )}
        />
        {value && (
          <Button
            type="button"
            onClick={() => onChange("")}
            className={cn(
              "absolute inset-y-0 right-0 flex items-center pr-4",
              "focus-visible:text-foreground focus-visible:outline-none",
              "touch-manipulation",
            )}
            aria-label="Clear search"
          >
            <IconX size={15} />
          </Button>
        )}
      </div>
    )
  },
)
