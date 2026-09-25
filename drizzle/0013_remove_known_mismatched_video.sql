UPDATE `problems`
SET `neetcode_video_url` = NULL,
    `video_source` = NULL,
    `video_lookup_status` = 'not_started'
WHERE `number` = '1'
  AND `neetcode_video_url` LIKE '%KLIXCFG5TnA%';
