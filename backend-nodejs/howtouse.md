how to use:

get on -> http://localhost:3000/emissions?start_date=2022-01-01T00:00:00Z&end_date=2022-12-31T23:59:59Z&avg_property=value.average&avg_operator=$gt&avg_value=0.03&agg_function=sum



post on http://localhost:3000/emissions:

{
"time": {
"interval_start": "2020-02-10T00:00:00Z",
"max": "2020-02-10T11:24:16.538000Z",
"min": "2020-02-10T11:22:17.261000Z"
},
"value": {
"average": 0.03328162725441731,
"count": 208,
"max": 0.037990983575582504,
"min": 0.027202757075428963,
"standard deviation": 0.0016672057338734186
}
}

not everything is implemented. I tried several things but ended up using the MongoDB aggregate option.


