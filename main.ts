import { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { getPosts } from "./utils/posts.ts";
import { ejs } from "oak/middleware/ejs/renderer.ts";

const app = new Application();
const router = new Router();

// Configure EJS view engine
app.use(ejs.engine({ viewsDir: "views" }));

// Basic routes
router
  .get("/", async (ctx) => {
    const posts = await getPosts();
    await ctx.render("index", { posts });
  });

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
