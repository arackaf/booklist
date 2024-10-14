FROM oven/bun:latest AS BUILDER

WORKDIR /app

COPY . .

RUN ["bun", "install"]
RUN ["bun", "build", "index.ts", "--compile", "--outfile", "run-pg_dump"]

FROM postgres:16.4

WORKDIR /app
COPY --from=BUILDER /app/run-pg_dump .
COPY --from=BUILDER /app/run-backup.sh .

RUN chmod +x ./run-backup.sh

CMD ["./run-backup.sh"]
