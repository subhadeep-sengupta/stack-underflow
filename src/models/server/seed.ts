import { db } from "../name";

import createQuestionCollection from "./question.collection";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";

export default async function getOrCreateDb() {
  try {
    await databases.get(db);
    console.log("Database Connected");
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log("Database Created");
      Promise.all([
        createAnswerCollection(),
        createCommentCollection(),
        createQuestionCollection(),
        createVoteCollection(),
      ]);
      console.log("Collections Created");
      console.log("Databae Connected");
    } catch (error) {
      console.error("Error Creating Databases:", error);
    }
  }
  return databases;
}
