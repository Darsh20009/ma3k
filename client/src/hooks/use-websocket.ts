import { useEffect, useRef, useCallback, useState } from "react";

type WebSocketMessage = {
  type: string;
  data?: any;
};

type WebSocketHookOptions = {
  userId?: string;
  userType?: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export function useWebSocket(options: WebSocketHookOptions) {
  const { userId, userType, onMessage, onConnect, onDisconnect } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);
  const [isConnected, setIsConnected] = useState(false);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!userId || !userType || !shouldReconnectRef.current) return;

    clearReconnectTimeout();

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (!shouldReconnectRef.current) {
          ws.close();
          return;
        }
        ws.send(JSON.stringify({
          type: "register",
          userId,
          userType
        }));
        setIsConnected(true);
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        onDisconnect?.();
        
        if (shouldReconnectRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            if (shouldReconnectRef.current) {
              connect();
            }
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  }, [userId, userType, onMessage, onConnect, onDisconnect, clearReconnectTimeout]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    clearReconnectTimeout();
    
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      wsRef.current.onopen = null;
      
      if (wsRef.current.readyState === WebSocket.OPEN || 
          wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
    setIsConnected(false);
  }, [clearReconnectTimeout]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    shouldReconnectRef.current = true;
    connect();
    
    return () => {
      disconnect();
    };
  }, [userId, userType]);

  return {
    isConnected,
    sendMessage,
    disconnect,
    reconnect: () => {
      shouldReconnectRef.current = true;
      connect();
    }
  };
}
