import { answerCollection, db } from "@/models/name";
import { databases, user } from "@/models/server/config";
import { UserPref } from "@/Store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();
    const response = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        content: answer,
        authorId: authorId,
        questionId: questionId,
      }
    );

    const prefs = await user.getPrefs<UserPref>(authorId);
    await user.updatePrefs(authorId, {
      reputation: Number(prefs.reputation) + 1,
    });
    return NextResponse.json(response, {
      status: 201,
    });
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
export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json();

    const answer = await databases.getDocument(db, answerCollection, answerId);

    const response = await databases.deleteDocument(
      db,
      answerCollection,
      answerId
    );

    const prefs = await user.getPrefs<UserPref>(answer.authorId);

    await user.updatePrefs(answer.authorId, {
      reputation: Number(prefs.reputation) - 1,
    });
    return NextResponse.json(
      { data: response },
      {
        status: 201,
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
