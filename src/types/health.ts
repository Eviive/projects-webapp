export type AuditEvent = {
    timestamp: string;
    principal: string;
    type: string;
    data: {
        type: string;
        message: string;
        details: {
            [key: string]: string;
        };
    };
}

export type Health = {
    status: "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";
    components: {
        db: {
            status: "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";
            details: {
                database: string;
            };
        },
        diskSpace: {
            status: "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";
            details: {
                path: string;
                total: number;
                free: number;
                threshold: number;
                exists: boolean;
            };
        },
        ping: {
            status: "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";
        }
    };
}

export type HttpExchange = {
    timestamp: string;
    principal?: {
        name: string;
    };
    request: {
        method: string;
        remoteAddress: string;
        uri: string;
        headers: {
            [key: string]: string[];
        };
    };
    response: {
        status: number;
        headers: {
            [key: string]: string[];
        };
    };
    timeTaken: number;
}

export type Info = {
    app: {
        name: string;
        description: string;
        version: string;
        stage: string;
    };
}
