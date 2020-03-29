select l.* from login as l
join company as c on c.c_id = l.c_id 
where c.cor_id = $1;