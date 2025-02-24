import { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { getPosts } from "./utils/posts.ts";

const app = new Application();
const router = new Router();

// Basic routes
router
  .get("/", async (ctx) => {
    const posts = await getPosts();
    ctx.response.body = "Welcome to the blog!";
  });

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
