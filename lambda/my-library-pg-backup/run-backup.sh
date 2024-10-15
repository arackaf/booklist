#!/bin/sh

echo "HELLO"
echo ${PG_URL}
PG_URI_CLEANED=$(echo ${PG_URI} | sed -e 's/^"//' -e 's/"$//')

pg_dump ${PG_URI_CLEANED} -f ./dump-output.sql

echo "pg_dump ${PG_URI_CLEANED} -f dump-output.sql"

./run-pg_dump