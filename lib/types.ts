export interface StationFacility {
  name: string
  class_name: string
  image: {
    title: string
    file: string
  }
}

export interface Station {
  id: number
  station_name: string
  station_code: string
  station_facility: StationFacility[]
}

export type RouteType = "least-distance" | "minimum-interchange"

export interface RoutePathStation {
  name: string
  status: string
}

export interface RouteLeg {
  line: string
  line_no: number
  path: RoutePathStation[]
  path_time: string
  station_interchange_time: number
  start: string
  end: string
  direction: string
  towards_station: string
  platform_name: string
  new_start_time: string
  new_end_time: string
}

export interface StationStatus {
  status: string
  title: string
  note: string
}

export interface RouteResult {
  stations: number
  from: string
  to: string
  from_station_status: StationStatus
  to_station_status: StationStatus
  total_time: string
  fare: number
  route: RouteLeg[]
  message: string
}
