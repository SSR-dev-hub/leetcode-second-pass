CREATE TABLE `note_images` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `problem_id` integer NOT NULL,
  `field` text NOT NULL,
  `marker` text NOT NULL,
  `blob_key` text NOT NULL,
  `content_type` text NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `note_images_marker_unique` ON `note_images` (`marker`);
--> statement-breakpoint
CREATE INDEX `note_images_problem_field_idx` ON `note_images` (`problem_id`,`field`);
