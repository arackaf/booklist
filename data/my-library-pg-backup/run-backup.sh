#!/bin/sh

PG_URI_CLEANED=$(echo ${PG_URI} | sed -e 's/^"//' -e 's/"$//')

pg_dump ${PG_URI_CLEANED} -Fc > ./backup.dump

pg_dump ${PG_URI_CLEANED} -f ./backup.sql

./run-pg_dump