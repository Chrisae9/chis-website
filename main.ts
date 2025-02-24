import { serve } from "https://deno.land/std@0.212.0/http/server.ts";
import { getPosts } from "./utils/posts.ts";
import { renderFile } from "https://deno.land/x/ejs@v0.5.0/mod.ts";

const posts = await getPosts();

serve(async (req: Request) => {
  const url = new URL(req.url);
  
  if (url.pathname === "/") {
    const template = await renderFile("./views/index.ejs", {
      posts, 
      filename: "./views/layout.ejs"
    });
    return new Response(template, {
      headers: { "content-type": "text/html" }
    });
  }

  return new Response("Not found", { status: 404 });
}, { port: 8000 });
