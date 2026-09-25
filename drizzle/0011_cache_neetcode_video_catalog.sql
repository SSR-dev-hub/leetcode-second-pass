CREATE TABLE `neetcode_video_catalog` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `title` text NOT NULL,
  `normalized_title` text NOT NULL,
  `url` text NOT NULL,
  `fetched_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `neetcode_video_catalog_url_unique` ON `neetcode_video_catalog` (`url`);
--> statement-breakpoint
CREATE INDEX `neetcode_video_catalog_normalized_title_idx` ON `neetcode_video_catalog` (`normalized_title`);
--> statement-breakpoint
CREATE TABLE `neetcode_video_catalog_state` (
  `id` integer PRIMARY KEY NOT NULL,
  `status` text DEFAULT 'not_started' NOT NULL,
  `channel_url` text NOT NULL,
  `fetched_at` integer,
  `video_count` integer DEFAULT 0 NOT NULL,
  `updated_at` integer NOT NULL
);
