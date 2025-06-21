export type Status = "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";

export interface Health {
    status: Status;
    components: {
        db: {
            status: Status;
            details?: {
                database: string;
            };
        };
        diskSpace: {
            status: Status;
            details?: {
                path: string;
                total: number;
                free: number;
                threshold: number;
                exists: boolean;
            };
        };
        ping: {
            status: Status;
        };
    };
}

export interface HttpExchange {
    uuid: string;
    timestamp: string;
    principal?: {
        name: string;
    };
    request: {
        method: string;
        remoteAddress: string;
        uri: string;
        headers: Record<string, string[]>;
    };
    response: {
        status: number;
        headers: Record<string, string[]>;
    };
    timeTaken: string;
}

export interface Info {
    app: {
        name: string;
        version: string;
        stage: string;
    };
}
