-- select *, c.c_id as c_id from company as c
-- join analytics as a on a.c_id = c.c_id
-- join report_setting as rs on rs.c_id = c.c_id
-- join settings as s on s.c_id = c.c_id
-- left join addon_emails as ae on ae.c_id = c.c_id
-- left join review_email as re on re.c_id = c.c_id
-- order by c.c_id;


select c.c_id as c_id, c.*,
a.reviews, a.customers, a.rank_key,
rs.*, 
s.*,
--ae.*,
re.*
from company as c
join analytics as a on a.c_id = c.c_id
join report_setting as rs on rs.c_id = c.c_id
join settings as s on s.c_id = c.c_id
--left join addon_emails as ae on ae.c_id = c.c_id
left join review_email as re on re.c_id = c.c_id
order by c.c_id;