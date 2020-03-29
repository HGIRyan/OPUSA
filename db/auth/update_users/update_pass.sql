update login 
set
c_id = $2,
email = $3,
username = $4,
sub_perm = $5,
hash_pass = $6
where user_id = $1
returning *;
