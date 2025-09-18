import { TypeEnum, UnitEnum } from "../types/products.types"

export const typeOptions = [
    { value: TypeEnum.product, label: 'Produto' },
    { value: TypeEnum.service, label: 'Serviço' }
]

export const UnitOptions = [
    { value: UnitEnum.liter, label: 'Litro' },
    { value: UnitEnum.kilograms, label: 'Quilogramas' }
]
