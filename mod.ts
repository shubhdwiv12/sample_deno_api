import { Application } from "https://deno.land/x/oak@v5.3.1/mod.ts";
import router from "./routes/router.ts";
const app = new Application();
const PORT = Deno.env.get("PORT") || 8000;

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Starting the Port at ${PORT}....`);
app.listen({ port: Number(PORT) });
