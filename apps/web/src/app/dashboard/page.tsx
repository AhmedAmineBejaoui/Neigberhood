"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  memberCount: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  community: { slug: string; name: string };
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"communities" | "activity">("communities");

  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["user-communities"],
          queryFn: async () => {
        const response = await fetch("/api/communities/user", {
          headers: {
            Authorization: `Bearer ${(session?.user as any)?.id}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch communities");
        return response.json();
      },
      enabled: !!(session?.user as any)?.id,
  });

  const { data: recentActivity = [] } = useQuery<Post[]>({
    queryKey: ["recent-activity"],
          queryFn: async () => {
        const response = await fetch("/api/posts/recent", {
          headers: {
            Authorization: `Bearer ${(session?.user as any)?.id}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch recent activity");
        return response.json();
      },
      enabled: !!(session?.user as any)?.id,
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to access your dashboard
          </h1>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session.user?.name || session.user?.email}!
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your communities and stay updated with recent activity.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("communities")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "communities"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  My Communities ({communities.length})
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "activity"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Recent Activity ({recentActivity.length})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "communities" && (
              <div className="space-y-4">
                {communities.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No communities yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Join a community to get started!
                    </p>
                    <Link
                      href="/join"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Join Community
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communities.map((community) => (
                      <div
                        key={community.id}
                        className="bg-white overflow-hidden shadow rounded-lg"
                      >
                        <div className="p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {community.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900">
                                {community.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {community.memberCount} members
                              </p>
                            </div>
                          </div>
                          <p className="mt-4 text-sm text-gray-600">
                            {community.description}
                          </p>
                          <div className="mt-6">
                            <Link
                              href={`/c/${community.slug}`}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                              View Community
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No recent activity
                    </h3>
                    <p className="text-gray-500">
                      Activity from your communities will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white overflow-hidden shadow rounded-lg"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {post.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                in {post.community.name} • {post.type}
                              </p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {post.type}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <Link
                              href={`/c/${post.community.slug}`}
                              className="text-sm text-blue-600 hover:text-blue-500"
                            >
                              View in Community →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
