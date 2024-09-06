import { Permission } from "node-appwrite";
import { db, questionAttachmentBucket } from "../name";
import { databases, storage } from "./config";

export default async function getOrCreateStorage() {
  try {
    storage.getBucket(questionAttachmentBucket);
    console.log("Attchment Bucket Found");
  } catch (error) {
    try {
      await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.read("any"),
          Permission.read("users"),
          Permission.create("users"),
          Permission.delete("users"),
          Permission.update("users"),
        ],
        false,
        undefined,
        undefined,
        ["jpg", "png", "gif", "jpeg", "webp", "heic"]
      );
      console.log("Storage Created");
      console.log("Storage Connected");
    } catch (error) {
      console.error("Error connecting Storage:", error);
    }
  }
}
