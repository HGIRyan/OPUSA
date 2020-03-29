insert into login
(c_id, email, username, hash_pass, permission)
values
($1, $2, $3, $4, $5);