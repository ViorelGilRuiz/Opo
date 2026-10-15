import { createServer } from "node:http";
import { readAsset } from "./http-assets.mjs";
import { fileURLToPath } from "node:url";
const base = new URL(
  process.argv.includes("--dist") ? "../dist/" : "../",
  import.meta.url,
);
const assets = new Map([
  ["/", ["index.html", "text/html"]],
  ["/index.html", ["index.html", "text/html"]],
  ["/app.js", ["app.js", "text/javascript"]],
  ["/styles.css", ["styles.css", "text/css"]],
]);
const port = Number(process.env.PORT || 3000);
const host=process.env.HOST || "127.0.0.1";
if(!["127.0.0.1","0.0.0.0"].includes(host))throw new Error("HOST debe ser 127.0.0.1 o 0.0.0.0.");
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("PORT debe ser un entero entre 1 y 65535.");
const server = createServer(async (req, res) => {
  let pathname;
  try { pathname = new URL(req.url, "http://localhost").pathname; } catch {res.writeHead(400);res.end("Solicitud inválida");return;}
  let asset = assets.get(pathname);
  if (!asset && /^\/(core|ui|data)\/[a-z0-9-]+\.mjs$/.test(pathname))
    asset = [pathname.slice(1), "text/javascript"];
  if (
    !asset &&
    /^\/assets\/exam-pages\/page-(3[3-9]|4[0-6])\.png$/.test(pathname)
  )
    asset = [pathname.slice(1), "image/png"];
  if (!asset && /^\/assets\/(?:aragon|zaragoza)-pages\/(first|second)-[0-9]{1,2}\.png$/.test(pathname)) asset=[pathname.slice(1), "image/png"];
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end();
    return;
  }
  if (!asset) {
    res.writeHead(404);
    res.end("No encontrado");
    return;
  }
  try {
    const {data,encoding,etag}=await readAsset(fileURLToPath(new URL(asset[0],base)),asset[1],req.headers['accept-encoding']);
    const headers={
      "Content-Type":asset[1].startsWith("text/")?asset[1]+"; charset=utf-8":asset[1],
      "Cache-Control":"public, max-age=0, must-revalidate",
      "X-Content-Type-Options":"nosniff",
      "Vary":"Accept-Encoding",
      "ETag":etag,
      ...(encoding!=="identity"?{"Content-Encoding":encoding}:{}),
    };
    const matches=(req.headers['if-none-match']??'').split(',').some(tag=>tag.trim()==='*'||tag.trim().replace(/^W\//,'')===etag);
    if(matches){res.writeHead(304,headers);res.end();return;}
    res.writeHead(200,{...headers,"Content-Length":data.length});
    res.end(req.method === "HEAD" ? undefined : data);
  } catch (error) {
    console.error(error.message);
    res.writeHead(error.code === "ENOENT" ? 404 : 500);
    res.end(
      "No se pudo leer el archivo. Ejecuta npm run build si usas npm start.",
    );
  }
});
server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? "Puerto ocupado. Cierra el otro servidor o configura PORT en .env."
      : error.message,
  );
  process.exitCode = 1;
});
server.listen(port, host, () =>
  console.log("OpoSprint: http://localhost:" + port),
);
