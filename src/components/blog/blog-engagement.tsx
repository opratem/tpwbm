"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Share2,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle,
  Facebook,
  Twitter,
  Link as LinkIcon,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  parentCommentId?: string | null;
}

interface BlogEngagementProps {
  slug: string;
  allowComments: boolean;
  postTitle: string;
  postUrl?: string;
}

export function BlogEngagement({
  slug,
  allowComments,
  postTitle,
  postUrl,
}: BlogEngagementProps) {
  const { data: session } = useSession();

  // Like state
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Comment form state
  const [commentContent, setCommentContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");

  // Share dropdown
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch likes on mount
  useEffect(() => {
    fetchLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchLikes = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}/likes`);
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likeCount);
        setHasLiked(data.hasLiked);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleLike = async () => {
    if (isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      const method = hasLiked ? "DELETE" : "POST";
      const response = await fetch(`/api/blog/${slug}/likes`, { method });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likeCount);
        setHasLiked(data.hasLiked);
        if (!hasLiked) {
          toast.success("Thanks for liking this post!");
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!allowComments) return;

    setIsCommentsLoading(true);
    try {
      const response = await fetch(`/api/blog/${slug}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
        setCommentCount(data.commentCount || 0);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const toggleComments = () => {
    if (!isCommentsExpanded && comments.length === 0) {
      fetchComments();
    }
    setIsCommentsExpanded(!isCommentsExpanded);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    // For non-logged-in users, require name and email
    if (!session?.user && (!authorName.trim() || !authorEmail.trim())) {
      toast.error("Please enter your name and email");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentContent.trim(),
          authorName: session?.user?.name || authorName.trim(),
          authorEmail: session?.user?.email || authorEmail.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Comment submitted successfully!");

        // If approved, add to local comments
        if (data.comment?.status === "approved") {
          setComments((prev) => [data.comment, ...prev]);
          setCommentCount((prev) => prev + 1);
        }

        // Reset form
        setCommentContent("");
        if (!session?.user) {
          setAuthorName("");
          setAuthorEmail("");
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Get full URL for sharing
  const fullUrl =
    postUrl ||
    (typeof window !== "undefined"
      ? window.location.href
      : `https://tpwbm.com.ng/blog/${slug}`);

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(`Check out: ${postTitle}`);
    const url = encodeURIComponent(fullUrl);

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      email: `mailto:?subject=${text}&body=${url}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }

    setIsShareOpen(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <Button
              variant={hasLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              disabled={isLikeLoading}
              className={hasLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}
            >
              {isLikeLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Heart
                  className={`h-4 w-4 mr-2 ${hasLiked ? "fill-current" : ""}`}
                />
              )}
              {likeCount > 0 ? `${likeCount} Like${likeCount !== 1 ? "s" : ""}` : "Like"}
            </Button>

            {/* Share Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsShareOpen(!isShareOpen)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              {isShareOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                  <div className="py-1">
                    <button
                      onClick={() => handleShare("facebook")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Twitter className="h-4 w-4 mr-3 text-sky-500" />
                      Twitter / X
                    </button>
                    <button
                      onClick={() => handleShare("email")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Mail className="h-4 w-4 mr-3 text-gray-600" />
                      Email
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                      ) : (
                        <LinkIcon className="h-4 w-4 mr-3 text-gray-600" />
                      )}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comment Toggle Button */}
          {allowComments && (
            <Button variant="outline" size="sm" onClick={toggleComments}>
              <MessageSquare className="h-4 w-4 mr-2" />
              {commentCount > 0
                ? `${commentCount} Comment${commentCount !== 1 ? "s" : ""}`
                : "Comment"}
              {isCommentsExpanded ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
          )}
        </div>

        {/* Click outside to close share menu */}
        {isShareOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsShareOpen(false)}
          />
        )}

        {/* Comments Section */}
        {allowComments && isCommentsExpanded && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-6 space-y-4">
              {!session?.user && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="authorName">Your Name *</Label>
                    <Input
                      id="authorName"
                      placeholder="Enter your name"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required={!session?.user}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorEmail">Your Email *</Label>
                    <Input
                      id="authorEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      required={!session?.user}
                    />
                  </div>
                </div>
              )}

              {session?.user && (
                <p className="text-sm text-gray-600">
                  Commenting as <strong>{session.user.name}</strong>
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="comment">Your Comment *</Label>
                <Textarea
                  id="comment"
                  placeholder="Write your comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                  required
                  className="resize-none"
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {session?.user
                    ? "Your comment will be posted immediately."
                    : "Your comment will be reviewed before posting."}
                </p>
                <Button type="submit" disabled={isSubmittingComment}>
                  {isSubmittingComment ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Post Comment
                </Button>
              </div>
            </form>

            {/* Comments List */}
            {isCommentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-50 rounded-lg p-4 border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {comment.authorName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        )}

        {!allowComments && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Comments are disabled for this post.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
