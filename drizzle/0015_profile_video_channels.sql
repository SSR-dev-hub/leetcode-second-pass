ALTER TABLE `profiles` ADD `video_channel_url` text DEFAULT 'https://www.youtube.com/@NeetCode/videos' NOT NULL;
--> statement-breakpoint
CREATE TABLE `profile_video_catalog` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `profile_id` integer NOT NULL,
  `channel_url` text NOT NULL,
  `title` text NOT NULL,
  `normalized_title` text NOT NULL,
  `url` text NOT NULL,
  `fetched_at` integer NOT NULL,
  FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profile_video_catalog_profile_channel_url_unique` ON `profile_video_catalog` (`profile_id`,`channel_url`,`url`);
--> statement-breakpoint
CREATE INDEX `profile_video_catalog_lookup_idx` ON `profile_video_catalog` (`profile_id`,`channel_url`,`normalized_title`);
--> statement-breakpoint
CREATE TABLE `profile_video_catalog_state` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `profile_id` integer NOT NULL,
  `channel_url` text NOT NULL,
  `status` text DEFAULT 'not_started' NOT NULL,
  `fetched_at` integer,
  `video_count` integer DEFAULT 0 NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profile_video_catalog_state_profile_channel_unique` ON `profile_video_catalog_state` (`profile_id`,`channel_url`);
--> statement-breakpoint
CREATE TABLE `video_lookup_queue` (
  `problem_id` integer PRIMARY KEY NOT NULL,
  `profile_id` integer NOT NULL,
  `channel_url` text NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `video_lookup_queue_profile_channel_idx` ON `video_lookup_queue` (`profile_id`,`channel_url`);
