update report_setting
set feedback_alert = $2
where c_id = $1;