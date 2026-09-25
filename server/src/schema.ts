import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey(),
  codeHash: text("code_hash").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  leetcodeSessionCookie: text("leetcode_session_cookie"),
  videoChannelUrl: text("video_channel_url").notNull().default("https://www.youtube.com/@NeetCode/videos"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const problems = sqliteTable("problems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  number: text("number").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  difficulty: text("difficulty").notNull(),
  topicsJson: text("topics_json").notNull().default("[]"),
  companyTagsJson: text("company_tags_json").notNull().default("[]"),
  inBlind75: integer("in_blind75", { mode: "boolean" }).notNull().default(false),
  inGrind169: integer("in_grind169", { mode: "boolean" }).notNull().default(false),
  inNeetcode150: integer("in_neetcode150", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull().default("spaced_learning"),
  level: text("level").notNull().default("New"),
  intuition: text("intuition").notNull().default(""),
  learnings: text("learnings").notNull().default(""),
  optimalSolution: text("optimal_solution").notNull().default(""),
  bruteForceSolution: text("brute_force_solution").notNull().default(""),
  edgeCases: text("edge_cases").notNull().default(""),
  timeComplexity: text("time_complexity").notNull().default(""),
  spaceComplexity: text("space_complexity").notNull().default(""),
  neetcodeVideoUrl: text("neetcode_video_url"),
  videoSource: text("video_source"),
  videoLookupStatus: text("video_lookup_status").notNull().default("not_started"),
  nextReview: text("next_review").notNull(),
  lastReviewed: text("last_reviewed"),
  repetitions: integer("repetitions").notNull().default(0),
  intervalDays: integer("interval_days").notNull().default(0),
  easeFactor: real("ease_factor").notNull().default(2.5),
  fsrsStability: real("fsrs_stability"),
  fsrsDifficulty: real("fsrs_difficulty"),
  fsrsState: integer("fsrs_state"),
  fsrsLapses: integer("fsrs_lapses").notNull().default(0),
  fsrsLearningSteps: integer("fsrs_learning_steps").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (table) => [uniqueIndex("problems_profile_number_unique").on(table.profileId, table.number)]);

export const noteImages = sqliteTable("note_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  problemId: integer("problem_id").notNull().references(() => problems.id, { onDelete: "cascade" }),
  field: text("field").notNull(),
  marker: text("marker").notNull().unique(),
  blobKey: text("blob_key").notNull(),
  contentType: text("content_type").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (table) => [index("note_images_problem_field_idx").on(table.problemId, table.field)]);

export const reviewHistory = sqliteTable("review_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  problemId: integer("problem_id").notNull().references(() => problems.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  reviewedOn: text("reviewed_on").notNull(),
  nextReview: text("next_review").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const acceptedSubmissions = sqliteTable("accepted_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  problemId: integer("problem_id").notNull().references(() => problems.id, { onDelete: "cascade" }),
  submissionNumber: text("submission_number").notNull(),
  submittedAt: integer("submitted_at", { mode: "timestamp_ms" }),
  url: text("url").notNull(),
  isBest: integer("is_best", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (table) => [uniqueIndex("accepted_submissions_problem_number_unique").on(table.problemId, table.submissionNumber)]);

export const neetcodeVideoCatalog = sqliteTable("neetcode_video_catalog", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  normalizedTitle: text("normalized_title").notNull(),
  url: text("url").notNull().unique(),
  fetchedAt: integer("fetched_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (table) => [index("neetcode_video_catalog_normalized_title_idx").on(table.normalizedTitle)]);

export const neetcodeVideoCatalogState = sqliteTable("neetcode_video_catalog_state", {
  id: integer("id").primaryKey(),
  status: text("status").notNull().default("not_started"),
  channelUrl: text("channel_url").notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp_ms" }),
  videoCount: integer("video_count").notNull().default(0),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const profileVideoCatalog = sqliteTable("profile_video_catalog", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  channelUrl: text("channel_url").notNull(),
  title: text("title").notNull(),
  normalizedTitle: text("normalized_title").notNull(),
  url: text("url").notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  uniqueIndex("profile_video_catalog_profile_channel_url_unique").on(table.profileId, table.channelUrl, table.url),
  index("profile_video_catalog_lookup_idx").on(table.profileId, table.channelUrl, table.normalizedTitle),
]);

export const profileVideoCatalogState = sqliteTable("profile_video_catalog_state", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  channelUrl: text("channel_url").notNull(),
  status: text("status").notNull().default("not_started"),
  fetchedAt: integer("fetched_at", { mode: "timestamp_ms" }),
  videoCount: integer("video_count").notNull().default(0),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (table) => [uniqueIndex("profile_video_catalog_state_profile_channel_unique").on(table.profileId, table.channelUrl)]);

export const videoLookupQueue = sqliteTable("video_lookup_queue", {
  problemId: integer("problem_id").primaryKey().references(() => problems.id, { onDelete: "cascade" }),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  channelUrl: text("channel_url").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (table) => [index("video_lookup_queue_profile_channel_idx").on(table.profileId, table.channelUrl)]);
