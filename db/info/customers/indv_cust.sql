select * from customer as c 
join feedback as f on f.cus_id = c.cus_id
where c.cus_id = $1;