FROM oven/bun:latest AS BUILDER

WORKDIR /app

COPY . .

RUN ["bun", "install"]
RUN ["bun", "build", "index.ts", "--compile", "--outfile", "run-pg_dump"]

# CMD ["./run-pg_dump"]
# ENTRYPOINT []

#------------------------------------------
FROM postgres:16.4

WORKDIR /app
COPY --from=BUILDER /app/run-pg_dump .
COPY --from=BUILDER /app/dump-output.sql .

CMD ["./run-pg_dump"]

# FROM oven/bun:latest

# WORKDIR /app
# COPY --from=BACKUP /app/run-pg_dump .
# COPY --from=BACKUP /app/dump-output.sql .
#------------------------------------------

#CMD ["pg_dump", "", "-f", "dump-output.sql"]


# COPY . .
#CMD ["pg_dump", ${PG_URI}, "-f", "dump-output.sql"]




