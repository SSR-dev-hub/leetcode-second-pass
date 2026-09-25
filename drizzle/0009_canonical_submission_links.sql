UPDATE accepted_submissions
SET url = 'https://leetcode.com/problems/' || (
  SELECT slug FROM problems WHERE problems.id = accepted_submissions.problem_id
) || '/submissions/' || submission_number || '/'
WHERE EXISTS (
  SELECT 1 FROM problems WHERE problems.id = accepted_submissions.problem_id
);
