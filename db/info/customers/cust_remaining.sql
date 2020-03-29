select c.activity, c.last_sent from customer as c
left join feedback as f on c.cus_id = f.cus_id
where
lower(c.service) =lower('reviews')
and c.active = true
and c.c_id = $1
and (f.rating is null or f.rating >= 3)
and (f.click = false or f.click is null)
and (lower(f.last_email) != lower('First Send') or f.last_email is null);