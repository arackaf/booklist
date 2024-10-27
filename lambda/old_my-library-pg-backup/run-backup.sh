#!/bin/sh

PG_URI_CLEANED=$(echo ${PG_URI} | sed -e 's/^"//' -e 's/"$//')

pg_dump ${PG_URI_CLEANED} -f dump-output.sql

./run-pg_dump