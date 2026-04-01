import { SearchContainer } from "@/components/containers/search"

export default function Page() {
  return (
    <div className="flex h-svh flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 overflow-hidden">
        <header>
          <h1 className="text-center text-lg font-semibold">Search stations</h1>
        </header>
        <SearchContainer />
      </div>
    </div>
  )
}
