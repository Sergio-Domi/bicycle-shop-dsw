import { apiFetch } from '../../../services/api'
import type {
    Bicycle,
    BicyclePayload,
} from '../types/bicycle'
export const bicycleService = {
    getAll() {
        return apiFetch<Bicycle[]>('/bicycles')
    },
    getById(id: number) {
        return apiFetch<Bicycle>(`/bicycles/${id}`)
    },
    create(payload: BicyclePayload) {
        return apiFetch<Bicycle>('/bicycles', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },
    update(id: number, payload: BicyclePayload) {
        return apiFetch<Bicycle>(`/bicycles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        })
    },
    remove(id: number) {
        return apiFetch<void>(`/bicycles/${id}`, {
            method: 'DELETE',
        })
    },
}