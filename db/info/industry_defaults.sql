select * from defaults 
where lower(industry) ilike lower($1) ;