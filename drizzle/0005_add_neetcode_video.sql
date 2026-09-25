ALTER TABLE `problems` ADD `neetcode_video_url` text;
--> statement-breakpoint
ALTER TABLE `problems` ADD `video_lookup_status` text DEFAULT 'not_started' NOT NULL;
