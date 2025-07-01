import axios from 'axios'
import { API_BASE } from './config'

export const getWeather = (city: string) => {
  return axios.get(`${API_BASE}/weather/live`, { params: { city } })
}
