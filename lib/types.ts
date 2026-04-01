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
