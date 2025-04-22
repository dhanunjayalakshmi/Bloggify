export const MOCKUSERDATA = {
  id: "user-123",
  username: "john_doe",
  full_name: "John Doe",
  bio: "Tech enthusiast. Sharing thoughts about JavaScript & web development.",
  profile_image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGEZghB-stFaphAohNqDAhEaXOWQJ9XvHKJw&s",
  banner_image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7ZZBqzUU-oAs_VS5HeeHuPz6whNiLkbFNRQ&s",

  social_links: {
    website: "https://johndoe.dev",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    twitter: "https://twitter.com/johndoe",
    instagram: null,
    other: [
      {
        label: "Dribbble",
        url: "https://dribbble.com/johndoe",
      },
    ],
  },

  stats: {
    blogs_published: 12,
    total_upvotes: 345,
    total_comments: 89,
    followers: 120,
    following: 45,
  },

  account_metadata: {
    join_date: "2023-05-14T12:00:00Z",
    last_active_at: "2025-04-21T15:34:12Z",
    visibility: "public",
  },

  notification_preferences: {
    email_notifications: true,
    push_notifications: false,
  },

  ai_settings: {
    ai_assist_opt_in: true,
  },

  badges: ["early_adopter", "top_writer"],

  profile_completion: 85,
};
