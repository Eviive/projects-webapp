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
};

export type Status = "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";

export type Health = {
    status: Status;
    components: {
        db: {
            status: Status;
            details: {
                database: string;
            };
        },
        diskSpace: {
            status: Status;
            details: {
                path: string;
                total: number;
                free: number;
                threshold: number;
                exists: boolean;
            };
        },
        ping: {
            status: Status;
        }
    };
};

export type HttpExchange = {
    uuid: string;
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
    timeTaken: string;
};

export type Info = {
    app: {
        name: string;
        description: string;
        version: string;
        stage: string;
    };
};
