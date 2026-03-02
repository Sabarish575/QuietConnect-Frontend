function LeftWidgets() {
  return (
    <div className="sticky top-24">
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 space-y-4">
        
        {/* User */}
        <div className="flex items-center gap-3">
          <Avatar name="hello" />
          <div className="min-w-0">
            <p className="text-sm text-neutral-200 font-medium truncate">
              {username}
            </p>
            <p className="text-xs text-neutral-500">
              Energy status
            </p>
          </div>
        </div>

        {/* Battery */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Battery</span>
            <span
              className={`font-medium ${
                energy <= 20
                  ? "text-red-400"
                  : energy >= 80
                  ? "text-green-400"
                  : "text-amber-400"
              }`}
            >
              {energy}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                energy <= 20
                  ? "bg-red-500"
                  : energy >= 80
                  ? "bg-green-500"
                  : "bg-amber-400"
              }`}
              style={{ width: `${energy}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
