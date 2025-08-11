// src/config/appwrite.config.ts
import { Client, Storage } from "node-appwrite";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppwriteService {
    private client: Client;
    private storage: Storage;

    constructor(private configService: ConfigService) {
        const APPWRITE_ENDPOINT =
            this.configService.get<string>("APPWRITE_ENDPOINT");
        const APPWRITE_PROJECT_ID = this.configService.get<string>(
            "APPWRITE_PROJECT_ID",
        );
        const APPWRITE_API_KEY =
            this.configService.get<string>("APPWRITE_API_KEY");
        if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
            throw new Error(
                "Missing Appwrite configuration. Please check your .env file.",
            );
        }
        this.client = new Client();
        this.client
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID)
            .setKey(APPWRITE_API_KEY);

        this.storage = new Storage(this.client);
    }
    getStorage(): Storage {
        return this.storage;
    }

    getBucketId(): string {
        const APPWRITE_BUCKET_ID =
            this.configService.get<string>("APPWRITE_BUCKET_ID");
        if (!APPWRITE_BUCKET_ID) {
            throw new Error(
                "Missing Appwrite bucket ID. Please check your .env file.",
            );
        }
        return APPWRITE_BUCKET_ID;
    }

    getProjectId(): string {
        const APPWRITE_PROJECT_ID = this.configService.get<string>(
            "APPWRITE_PROJECT_ID",
        );
        if (!APPWRITE_PROJECT_ID) {
            throw new Error(
                "Missing Appwrite project ID. Please check your .env file.",
            );
        }
        return APPWRITE_PROJECT_ID;
    }
}
