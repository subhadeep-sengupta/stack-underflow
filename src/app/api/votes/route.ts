import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, user } from "@/models/server/config";
import { UserPref } from "@/Store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    //grab the data

    const { votedById, voteStatus, type, typeId } = await request.json();

    //list all the documents
    const response = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeStatus", typeId),
      Query.equal("votedById", votedById),
    ]);

    if (response.documents.length > 0) {
      await databases.deleteDocument(
        db,
        voteCollection,
        response.documents[0].$id
      );

      const qustionOrAnswer = await databases.getDocument(
        db,
        type === "questions" ? questionCollection : answerCollection,
        typeId
      );
      const authorPefs = await user.getPrefs<UserPref>(
        qustionOrAnswer.authorId
      );

      await user.updatePrefs<UserPref>(qustionOrAnswer.authorId, {
        reputation:
          response.documents[0].voteStatus === "upvoted"
            ? Number(authorPefs.reputation) - 1
            : Number(authorPefs.reputation) + 1,
      });
    }

    if (response.documents[0]?.voteStatus !== voteStatus) {
      const doc = await databases.createDocument(
        db,
        voteCollection,
        ID.unique(),
        {
          type,
          typeId,
          voteStatus,
        }
      );

      const qustionOrAnswer = await databases.getDocument(
        db,
        type === "questions" ? questionCollection : answerCollection,
        typeId
      );
      const authorPefs = await user.getPrefs<UserPref>(
        qustionOrAnswer.authorId
      );

      if (response.documents[0]) {
        await user.updatePrefs<UserPref>(qustionOrAnswer.authorId, {
          reputation:
            response.documents[0].voteStatus === "upvoted"
              ? Number(authorPefs.reputation) - 1
              : Number(authorPefs.reputation) + 1,
        });
      } else {
        await user.updatePrefs<UserPref>(qustionOrAnswer.authorId, {
          reputation:
            voteStatus === "upvoted"
              ? Number(authorPefs.reputation) + 1
              : Number(authorPefs.reputation) - 1,
        });
      }
    }

    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1),
      ]),
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1),
      ]),
    ]);

    return NextResponse.json(
      {
        data: {
          document: null,
          voteResult: (upvotes.total = downvotes.total),
        },
        message: "vote Handled",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error creating answers",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}
