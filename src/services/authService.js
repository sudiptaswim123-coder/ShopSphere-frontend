import { apiRequest } from './api'
export const login = (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
export const register = (details) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(details) })