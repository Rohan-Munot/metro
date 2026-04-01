import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { IconSearch, IconX } from "@tabler/icons-react"

interface SearchFieldProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onFocus: () => void
  onClear: () => void
}

export const SearchField = ({
  placeholder,
  value,
  onChange,
  onFocus,
  onClear,
}: SearchFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <InputGroup className="h-11">
        <InputGroupAddon className="pl-3 text-muted-foreground transition-colors group-has-[[data-slot=input-group-control]:focus]/input-group:text-primary">
          <IconSearch className="size-4.5" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={placeholder}
          className="h-11"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
        />
        <InputGroupButton
          type="button"
          aria-label={`Clear ${placeholder.toLowerCase()}`}
          className={`mr-2 transition-opacity ${
            value ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          tabIndex={value ? 0 : -1}
          onClick={onClear}
        >
          <IconX className="size-4.5" />
        </InputGroupButton>
      </InputGroup>
    </div>
  )
}
