import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const connectSocket = useCallback(() => {
        const SOCKET_URL = import.meta.env.VITE_BASE_URL;
        
        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
            autoConnect: true,
            auth: {
                token: localStorage.getItem('token')
            }
        });

        socketInstance.on('connect', () => {
            console.log('✅ Socket connected:', socketInstance.id);
            setIsConnected(true);
            setRetryCount(0);
        });

        socketInstance.on('reconnect_attempt', (attemptNumber) => {
            console.log(`🔄 Reconnection attempt ${attemptNumber}`);
            setRetryCount(attemptNumber);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
            setIsConnected(false);
            
            if (reason === 'io server disconnect') {
                // Server disconnected us, try to reconnect
                socketInstance.connect();
            }
        });

        socketInstance.on('connect_error', (error) => {
            console.error('⚠️ Connection error:', error);
            setIsConnected(false);
        });

        socketInstance.on('error', (error) => {
            console.error('Socket error:', error);
            if (error.type === 'TransportError') {
                socketInstance.connect();
            }
        });

        return socketInstance;
    }, []);

    useEffect(() => {
        const socketInstance = connectSocket();
        setSocket(socketInstance);

        return () => {
            if (socketInstance) {
                socketInstance.removeAllListeners();
                socketInstance.close();
                console.log("🔄 Socket cleanup completed");
            }
        };
    }, [connectSocket]);

    const sendMessage = useCallback((eventName, data) => {
        if (!socket || !isConnected) {
            console.warn('⚠️ Cannot send message, socket disconnected');
            return false;
        }

        try {
            socket.emit(eventName, data);
            return true;
        } catch (error) {
            console.error(`Error sending message ${eventName}:`, error);
            return false;
        }
    }, [socket, isConnected]);

    const receiveMessage = useCallback((eventName, callback) => {
        if (!socket) {
            console.warn(`⚠️ Cannot listen for ${eventName}, socket not initialized`);
            return () => {};
        }

        const wrappedCallback = (...args) => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`Error in ${eventName} handler:`, error);
            }
        };

        socket.on(eventName, wrappedCallback);
        console.log(`📥 Listening for: ${eventName}`);

        return () => {
            socket.off(eventName, wrappedCallback);
            console.log(`🛑 Stopped listening: ${eventName}`);
        };
    }, [socket]);

    const value = {
        socket,
        isConnected,
        sendMessage,
        receiveMessage,
        retryCount
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;

