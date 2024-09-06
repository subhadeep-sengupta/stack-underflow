import { Permission } from "node-appwrite";
import { db, commentCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  databases.createCollection(db, commentCollection, commentCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.delete("users"),
    Permission.update("users"),
  ]);
  console.log("Comment Collection Created");

  await Promise.all([
    databases.createStringAttribute(
      db,
      commentCollection,
      "content",
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      commentCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
    databases.createEnumAttribute(
      db,
      commentCollection,
      "type",
      ["answer", "questions"],
      true
    ),
  ]);

  console.log("Comment attributes created");
}
