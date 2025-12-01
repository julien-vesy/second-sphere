import { createMemo, createSignal } from 'solid-js'
import { fetchOrderStatus } from '../utils/order-status-api.ts'
import {
  getCachedOrderStatus,
  setCachedOrderStatus,
} from '../utils/order-status-cache.ts'

export type OrderStatus = 'loading' | 'open' | 'closed' | 'error'

const [orderStatus, setOrderStatus] = createSignal<OrderStatus>('loading')
const [isInitialized, setIsInitialized] = createSignal(false)

const loadOrderStatus = async (): Promise<void> => {
  if (isInitialized()) {
    return
  }

  const cached = getCachedOrderStatus()
  if (cached) {
    setOrderStatus(cached.ordersOpen ? 'open' : 'closed')
    setIsInitialized(true)
    return
  }

  try {
    const data = await fetchOrderStatus()
    setCachedOrderStatus(data)
    setOrderStatus(data.ordersOpen ? 'open' : 'closed')
    setIsInitialized(true)
  } catch (error) {
    console.error('Error loading order status:', error)
    setOrderStatus('error')
    setIsInitialized(true)
  }
}

const refreshOrderStatus = async (): Promise<void> => {
  setOrderStatus('loading')
  setIsInitialized(false)
  await loadOrderStatus()
}

const isLoading = createMemo(() => orderStatus() === 'loading')
const isOpen = createMemo(() => orderStatus() === 'open')
const isClosed = createMemo(() => orderStatus() === 'closed')
const isError = createMemo(() => orderStatus() === 'error')

export const orderStatusStore = {
  isLoading,
  isOpen,
  isClosed,
  isError,
  initialized: isInitialized,
  load: loadOrderStatus,
  refresh: refreshOrderStatus,
}
