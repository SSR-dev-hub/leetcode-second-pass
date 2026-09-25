CREATE TABLE `accepted_submissions_new` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `problem_id` integer NOT NULL,
  `submission_number` text NOT NULL,
  `submitted_at` integer,
  `url` text NOT NULL,
  `is_best` integer DEFAULT false NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `accepted_submissions_new` (`id`, `problem_id`, `submission_number`, `submitted_at`, `url`, `is_best`, `created_at`)
SELECT `id`, `problem_id`, `submission_number`, `submitted_at`, `url`, `is_best`, `created_at` FROM `accepted_submissions`;
--> statement-breakpoint
DROP TABLE `accepted_submissions`;
--> statement-breakpoint
ALTER TABLE `accepted_submissions_new` RENAME TO `accepted_submissions`;
--> statement-breakpoint
CREATE UNIQUE INDEX `accepted_submissions_problem_number_unique` ON `accepted_submissions` (`problem_id`,`submission_number`);
