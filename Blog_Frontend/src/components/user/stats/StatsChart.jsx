import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2 shadow text-sm">
        <p className="text-gray-900 dark:text-gray-100 font-medium">
          {data.title}
        </p>

        {data.views !== undefined && (
          <p className="text-gray-600 dark:text-gray-300">
            Views: {data.views}
          </p>
        )}

        {data.engagement !== undefined && (
          <p className="text-gray-600 dark:text-gray-300">
            Engagement: {data.engagement}
          </p>
        )}
      </div>
    );
  }

  return null;
};

const ReactionsTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2 shadow text-sm">
        <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
          {data.title}
        </p>
        {payload.map((entry) =>
          entry.value > 0 ? (
            <p key={entry.dataKey} className="text-gray-600 dark:text-gray-300">
              {entry.dataKey} {entry.value}
            </p>
          ) : null,
        )}
      </div>
    );
  }
  return null;
};

const EMOJI_COLORS = {
  "❤️": "#ef4444",
  "🔥": "#f97316",
  "💡": "#eab308",
  "🤔": "#8b5cf6",
  "🎉": "#22c55e",
};
const EMOJIS = ["❤️", "🔥", "💡", "🤔", "🎉"];

export default function StatsChart({ blogs }) {
  const viewsData =
    blogs?.map((blog) => ({
      title: blog.title,
      views: blog.views,
    })) || [];

  const engagementData =
    blogs?.map((blog) => ({
      title: blog.title,
      engagement: blog.upvotes + blog.comments,
    })) || [];

  const reactionsData = blogs
    ?.filter((blog) => blog.reactions && Object.keys(blog.reactions).length > 0)
    .map((blog) => {
      const entry = { title: blog.title };
      EMOJIS.forEach((e) => {
        entry[e] = blog.reactions?.[e] || 0;
      });
      return entry;
    }) || [];

  const formatTitle = (title) => {
    if (!title) return "";
    return title.length > 15 ? title.slice(0, 15) + "..." : title;
  };

  const postsPerMonth = {};

  blogs?.forEach((blog) => {
    if (!blog.created_at) return;

    const date = new Date(blog.created_at);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;

    if (!postsPerMonth[monthKey]) {
      postsPerMonth[monthKey] = {
        month: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        posts: 0,
      };
    }

    postsPerMonth[monthKey].posts += 1;
  });

  const publishingData = Object.entries(postsPerMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);

  return (
    <div className="flex flex-col gap-4">
      {/* Views Chart */}
      <div className="w-full h-96 bg-background rounded-xl shadow p-4 dark:bg-gray-900">
        <h3 className="text-sm font-semibold mb-4">Views Per Blog</h3>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={viewsData}
            margin={{ top: 20, right: 20, left: 0, bottom: 90 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="title"
              tickFormatter={formatTitle}
              angle={-30}
              textAnchor="end"
              interval={0}
              height={70}
            />

            <YAxis />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: document.documentElement.classList.contains("dark")
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              }}
            />

            <Bar
              dataKey="views"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement Chart */}
      <div className="w-full h-96 bg-background rounded-xl shadow p-4 dark:bg-gray-900">
        <h3 className="text-sm font-semibold mb-4">Engagement Per Blog</h3>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={engagementData}
            margin={{ top: 20, right: 20, left: 0, bottom: 90 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="title"
              tickFormatter={formatTitle}
              angle={-30}
              textAnchor="end"
              interval={0}
              height={70}
            />

            <YAxis />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: document.documentElement.classList.contains("dark")
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              }}
            />

            <Bar
              dataKey="engagement"
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reactions Per Blog Chart */}
      {reactionsData.length > 0 && (
        <div className="w-full h-96 bg-background rounded-xl shadow p-4 dark:bg-gray-900">
          <h3 className="text-sm font-semibold mb-4">Reactions Per Blog</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={reactionsData}
              margin={{ top: 20, right: 20, left: 0, bottom: 90 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="title"
                tickFormatter={formatTitle}
                angle={-30}
                textAnchor="end"
                interval={0}
                height={70}
              />
              <YAxis allowDecimals={false} />
              <Tooltip
                content={<ReactionsTooltip />}
                cursor={{
                  fill: document.documentElement.classList.contains("dark")
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                }}
              />
              <Legend verticalAlign="top" />
              {EMOJIS.map((emoji) => (
                <Bar
                  key={emoji}
                  dataKey={emoji}
                  stackId="reactions"
                  fill={EMOJI_COLORS[emoji]}
                  barSize={40}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Publishing Activity Chart */}
      <div className="w-full h-96 bg-background rounded-xl shadow p-4 dark:bg-gray-900">
        <h3 className="text-sm font-semibold mb-4">
          Publishing Activity (Posts Per Month)
        </h3>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={publishingData}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="posts"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: "#6366f1" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
