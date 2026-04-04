"use client"

import { useState, useCallback } from "react"

type GeolocationState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "success"; lat: number; lng: number }
  | { status: "error"; message: string }

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ status: "idle" })

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        status: "error",
        message: "Geolocation is not supported by your browser",
      })
      return
    }

    setState({ status: "locating" })

    // First try: fast, low-accuracy (network/cell-tower) — works even without GPS
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: "success",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Location access denied. Please allow location permission in your browser or device settings.",
          2: "Could not determine your location. Make sure location services are enabled on your device.",
          3: "Location request timed out. Please check your location settings and try again.",
        }
        setState({
          status: "error",
          message: messages[err.code] ?? "Failed to get location.",
        })
      },
      {
        enableHighAccuracy: false, // use network/Wi-Fi, not GPS — faster and more reliable
        timeout: 15_000,
        maximumAge: 5 * 60_000, // accept a cached position up to 5 min old
      }
    )
  }, [])

  const reset = useCallback(() => setState({ status: "idle" }), [])

  return { state, request, reset }
}
