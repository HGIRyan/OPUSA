update company
set 
owner_name = $2,
email = $3
where c_id = $1;
