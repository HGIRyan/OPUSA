insert into feedback 
(cus_id, feedback_text, rating, click, email_status, opened_time, last_email, rating_history, updated)
values
($1, $2, $3, $4, $5, $6, $7, $8, false)
returning *;