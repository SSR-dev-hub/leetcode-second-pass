DROP TABLE entries;
--> statement-breakpoint
CREATE TABLE settings (
  id INTEGER PRIMARY KEY,
  code_hash TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE problems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  topics_json TEXT NOT NULL DEFAULT '[]',
  in_blind75 INTEGER NOT NULL DEFAULT 0,
  in_top150 INTEGER NOT NULL DEFAULT 0,
  in_neetcode150 INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'learning',
  level TEXT NOT NULL DEFAULT 'New',
  intuition TEXT NOT NULL DEFAULT '',
  learnings TEXT NOT NULL DEFAULT '',
  optimal_solution TEXT NOT NULL DEFAULT '',
  brute_force_solution TEXT NOT NULL DEFAULT '',
  edge_cases TEXT NOT NULL DEFAULT '',
  time_complexity TEXT NOT NULL DEFAULT '',
  space_complexity TEXT NOT NULL DEFAULT '',
  next_review TEXT NOT NULL,
  last_reviewed TEXT,
  repetitions INTEGER NOT NULL DEFAULT 0,
  interval_days INTEGER NOT NULL DEFAULT 0,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX problems_profile_number_unique ON problems(profile_id, number);
--> statement-breakpoint
CREATE TABLE review_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  reviewed_on TEXT NOT NULL,
  next_review TEXT NOT NULL,
  created_at INTEGER NOT NULL
);