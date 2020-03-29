update gmb
set
c_id = $2,
label = $3 
where location_id = $1;