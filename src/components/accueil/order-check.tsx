import { createResource, Match, Switch } from 'solid-js'

const fetchEnableOrder = async (): Promise<boolean> => {
  const response = await fetch(
    `${import.meta.env.DEV ? 'http://localhost:8888' : ''}/.netlify/functions/getCommandStatus`
  )
  if (!response.ok) throw new Error('Failed to fetch order status')
  const data: {
    ordersOpen: boolean
  } = await response.json()
  return data.ordersOpen
}

export default function OrderCheck() {
  const [ordersOpen] = createResource(fetchEnableOrder)

  return (
    <Switch
      fallback={
        <button
          disabled
          class="text-white inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none h-10 rounded-md px-6 bg-gradient-to-r from-gray-400 to-gray-500 shadow-lg cursor-not-allowed"
        >
          ⚠️ Erreur de chargement
        </button>
      }
    >
      <Match when={ordersOpen.loading}>
        <button
          disabled
          class="text-white inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none h-10 rounded-md px-6 bg-gradient-to-r from-gray-400 to-gray-500 shadow-lg cursor-not-allowed"
        >
          <span class="animate-pulse">Chargement...</span>
        </button>
      </Match>

      <Match when={!ordersOpen.loading && ordersOpen()}>
        <button
          onClick={() => (window.location.href = '/devis')}
          class="text-white inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all outline-none focus-visible:ring-2 h-10 rounded-md px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg cursor-pointer active:scale-95"
        >
          <span class="relative flex size-3">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex size-3 rounded-full bg-green-500"></span>
          </span>
          &nbsp;Commandes ouvertes
        </button>
      </Match>

      <Match when={!ordersOpen.loading && !ordersOpen()}>
        <button
          disabled
          class="text-white inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none h-10 rounded-md px-6 bg-gradient-to-r from-gray-400 to-gray-500 shadow-lg cursor-not-allowed"
        >
          <span class="relative flex size-3">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex size-3 rounded-full bg-red-500"></span>
          </span>
          &nbsp;Commandes fermées
        </button>
      </Match>
    </Switch>
  )
}
