import env from "@/app/env";

import { Client, Account, Storage, Databases, Avatars } from "appwrite";

const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectId); // Your project ID

const account = new Account(client);

const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);

export { account, databases, storage, avatars, client };
