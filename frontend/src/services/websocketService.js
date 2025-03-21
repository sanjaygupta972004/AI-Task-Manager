class WebSocketService {
      constructor() {
        this.socket = null
        this.callbacks = {}
        this.isConnected = false
      }
    
      connect() {
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'
        
        this.socket = new WebSocket(wsUrl)
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established')
          this.isConnected = true
        }
        
        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            const { type } = data
            
            if (this.callbacks[type] && Array.isArray(this.callbacks[type])) {
              this.callbacks[type].forEach(callback => callback(data))
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }
        
        this.socket.onclose = () => {
          console.log('WebSocket connection closed')
          this.isConnected = false
          
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            this.connect()
          }, 5000)
        }
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.socket.close()
        }
      }
    
      subscribe(type, callback) {
        if (!this.callbacks[type]) {
          this.callbacks[type] = []
        }
        
        this.callbacks[type].push(callback)
        
        // Return unsubscribe function
        return () => {
          this.callbacks[type] = this.callbacks[type].filter(cb => cb !== callback)
        }
      }
    
      send(type, data) {
        if (!this.isConnected) {
          console.error('WebSocket is not connected')
          return
        }
        
        const message = JSON.stringify({
          type,
          data,
          timestamp: new Date().toISOString()
        })
        
        this.socket.send(message)
      }
    
      disconnect() {
        if (this.socket) {
          this.socket.close()
        }
      }
    }
    
    // Create singleton instance
    const websocketService = new WebSocketService()
    
    export default websocketService