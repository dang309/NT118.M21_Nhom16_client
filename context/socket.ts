import { io } from "socket.io-client";
import * as React from "react";

const SOCKET_URL = "https://api-nhom16.herokuapp.com";

export const socket = io(SOCKET_URL);
export const SocketContext = React.createContext(socket);
