import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const communityId = searchParams.get('communityId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    
    if (type) {
      where.type = type;
    }
    
    if (communityId) {
      where.communityId = communityId;
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        community: {
          select: {
            name: true,
            slug: true
          }
        },
        author: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      type: post.type,
      community: {
        name: post.community.name,
        slug: post.community.slug
      },
      author: post.author.fullName,
      createdAt: post.createdAt.toISOString()
    }));

    return NextResponse.json({
      data: formattedPosts,
      paging: {
        hasMore: posts.length === limit,
        total: posts.length
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
