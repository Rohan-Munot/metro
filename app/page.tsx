import { MetroSearch } from "@/components/metro-search"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col px-4 pt-6 pb-[env(safe-area-inset-bottom)] sm:px-6 sm:pt-10">
      <div className="mx-auto flex w-full max-w-md flex-col justify-between gap-8">
        <header>
          <h1 className="text-lg font-semibold text-center">Metro Route Finder</h1>
        </header>

        <MetroSearch />
      </div>
    </div>
  )
}
