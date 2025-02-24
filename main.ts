import { serve } from "https://deno.land/std@0.212.0/http/server.ts";
import { getPosts } from "./utils/posts.ts";
const posts = await getPosts();

serve(async (req: Request) => {
  const url = new URL(req.url);
  
  if (url.pathname === "/") {
    const layout = await Deno.readTextFile("./views/layout.ejs");
    const indexContent = await Deno.readTextFile("./views/index.ejs");
    const html = layout.replace("</head>", `${indexContent}</head>`);
    return new Response(html, {
      headers: { "content-type": "text/html" }
    });
  }

  return new Response("Not found", { status: 404 });
}, { port: 8000 });
