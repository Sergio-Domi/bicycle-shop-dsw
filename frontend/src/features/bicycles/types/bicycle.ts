export interface Bicycle {
    id: number
    brand: string
    model: string
    description: string | null
    price: number | string
    stock: number
    createdAt?: string
    updatedAt?: string
}
export interface BicyclePayload {
    brand: string
    model: string
    description: string | null
    price: number
    stock: number
}