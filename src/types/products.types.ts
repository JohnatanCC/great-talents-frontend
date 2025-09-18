
export enum TypeEnum {
    service = "service",
    product = "product",
}

export enum UnitEnum {
    liter = "L",
    kilograms = "KG",
}

export interface IFormInput {
    name: string
    priceSale: string
    type: TypeEnum
    unit: UnitEnum
    description: string
    url: string
}