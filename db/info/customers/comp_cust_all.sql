select *, c.cus_id as cus_id, f.cus_id as id from customer as c 
left join feedback as f on f.cus_id = c.cus_id
where c.c_id = $1 order by c.cus_id;