import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            memberships: true,
            posts: true
          }
        }
      }
    });

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      );
    }

    const formattedCommunity = {
      id: community.id,
      name: community.name,
      slug: community.slug,
      description: community.description || "",
      memberCount: community._count.memberships,
      postCount: community._count.posts,
      joinPolicy: community.joinPolicy,
      createdAt: community.createdAt.toISOString()
    };

    return NextResponse.json({
      data: formattedCommunity
    });
  } catch (error) {
    console.error("Error fetching community:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
