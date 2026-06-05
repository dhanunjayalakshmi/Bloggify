import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/apiClient";

const SeriesWidget = ({ blogId }) => {
  const [series, setSeries] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!blogId) return;
    api
      .get(`/series/blog/${blogId}`)
      .then((res) => setSeries(res.data.series))
      .catch(() => {});
  }, [blogId]);

  if (!series) return null;

  return (
    <div className="my-8 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400 mb-1">
        Part of a series
      </p>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
        {series.title}
      </h3>
      {series.description && (
        <p className="text-sm text-muted-foreground mb-4">{series.description}</p>
      )}

      <ol className="space-y-2">
        {series.parts.map((part) => (
          <li key={part.blogId} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                part.isCurrent
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {part.order + 1}
            </span>

            {part.isCurrent ? (
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {part.title}
                <span className="ml-2 text-xs font-normal text-blue-400">(current)</span>
              </span>
            ) : (
              <button
                onClick={() => navigate(`/blogs/${part.blogId}`)}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:underline text-left"
              >
                {part.title}
              </button>
            )}
          </li>
        ))}
      </ol>

      {/* Prev / Next navigation */}
      <div className="mt-5 flex justify-between gap-3">
        {(() => {
          const currentIdx = series.parts.findIndex((p) => p.isCurrent);
          const prev = series.parts[currentIdx - 1];
          const next = series.parts[currentIdx + 1];
          return (
            <>
              {prev ? (
                <button
                  onClick={() => navigate(`/blogs/${prev.blogId}`)}
                  className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                >
                  ← Part {prev.order + 1}
                </button>
              ) : <span />}
              {next ? (
                <button
                  onClick={() => navigate(`/blogs/${next.blogId}`)}
                  className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                >
                  Part {next.order + 1} →
                </button>
              ) : <span />}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default SeriesWidget;
