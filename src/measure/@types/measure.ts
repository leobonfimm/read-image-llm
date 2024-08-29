export interface MeasureCreateRequest {
  image: string,
  customerCode: string,
  measureDateTime: Date,
  measureType: "WATER" | "GAS",
}

export interface MeasureConfirmRequest {
  measureId: string,
  confirmedValue: number
}
