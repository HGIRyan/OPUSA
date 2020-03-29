select l.*, c.cor_id from login as l
join company as c on c.c_id = l.c_id
where lower(l.username) = lower($1) or lower(l.email) = lower($1);