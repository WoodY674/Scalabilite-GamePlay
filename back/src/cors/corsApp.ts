
import cors from 'cors';

export const corsApp = {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type, Authorization"],
        credentials: true
    }
}