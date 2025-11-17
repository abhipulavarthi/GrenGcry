// Mocked socket service: disabled real WebSocket for offline mode
export function connectSocket() {
  // no-op in mock mode
}

export function onMessage(cb) {
  // Optionally simulate alerts
  // setTimeout(() => cb({ type: 'alert', message: 'Mock stock alert' }), 1000)
}

export function sendMessage() {
  // no-op in mock mode
}
