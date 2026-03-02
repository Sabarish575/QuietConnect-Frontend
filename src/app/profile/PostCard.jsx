import { HeartIcon, MessageSquare, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

function PostCard({ post }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/blogpage/${post.id}`)}
      className="
        group relative rounded-2xl p-5
        bg-black
        border border-white/10
        hover:border-white/25
        hover:bg-white/5
        transition-all duration-200
        cursor-pointer
      "
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-white/90 group-hover:text-white">
        {post.title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-white/50 line-clamp-3">
        {post.description}
      </p>

      {/* Meta Row */}
      <div className="mt-4 flex items-center justify-between text-xs text-white/40">

        {/* Time */}
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>
            {post.createdAt}
          </span>
        </div>

        {/* Engagement */}
        <div className="flex items-center gap-4">

          <div className="flex items-center gap-1 group-hover:text-white transition">
            <HeartIcon size={16} />
            <span>{post.likeCount}</span>
          </div>

          <div className="flex items-center gap-1 group-hover:text-white transition">
            <MessageSquare size={16} />
            <span>{post.commentCount}</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PostCard;
