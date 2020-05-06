select count(*) as total from customer as c
left join feedback as f on f.cus_id = c.cus_id
where c.c_id = $1 and c.last_sent = '2005-05-25';