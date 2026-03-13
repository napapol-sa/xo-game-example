import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { result } = await req.json();
  const userId = (session.user as any).id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { score: true, winStreak: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {
      gameLogs: {
        create: { result },
      },
    };

    let newWinStreak = user.winStreak;
    let scoreIncrement = 0;

    if (result === "WIN") {
      scoreIncrement = 1;
      newWinStreak += 1;
      if (newWinStreak === 3) {
        scoreIncrement += 1; // Bonus point
        newWinStreak = 0; // Reset streak
      }
    } else if (result === "LOSS") {
      scoreIncrement = -1;
      newWinStreak = 0; // Reset streak on loss
    } else {
      newWinStreak = 0; // Reset streak on draw
    }

    updateData.score = { increment: scoreIncrement };
    updateData.winStreak = newWinStreak;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { score: true, winStreak: true },
    });

    return NextResponse.json({ score: updatedUser.score, winStreak: updatedUser.winStreak });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        score: true,
        winStreak: true,
        gameLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    const leaderboard = await prisma.user.findMany({
      orderBy: { score: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        score: true,
        image: true,
      },
    });

    return NextResponse.json({
      score: user?.score || 0,
      logs: user?.gameLogs || [],
      winStreak: user?.winStreak || 0,
      leaderboard: leaderboard,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
