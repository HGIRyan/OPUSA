update customer 
set
first_name = $1,
last_name = $2,
email = $3,
phone= $4
where cus_id = $5
returning * ;