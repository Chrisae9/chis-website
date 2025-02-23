FROM denoland/deno:alpine-1.37

WORKDIR /app

COPY . .

CMD ["deno", "run", "--allow-read", "--allow-net", "--watch", "main.ts"]
