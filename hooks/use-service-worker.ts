'use client'

export function useServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration)
      })
      .catch((error) => {
        console.log('Erro ao registrar Service Worker:', error)
      })
  }
}
