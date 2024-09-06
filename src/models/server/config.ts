import env from "@/app/env";
import { Client, Avatars, Databases, Storage, Users } from "node-appwrite";

let client = new Client();

client
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectId) // Your project ID
  .setKey(env.appwrite.apiKey); // Your secret API key
// Use only on dev mode with a self-signed SSL cert
const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const user = new Users(client);

export { user, databases, storage, avatars, client };
