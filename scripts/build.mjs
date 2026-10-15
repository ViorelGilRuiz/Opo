import { mkdir, copyFile, cp } from "node:fs/promises";
const output = new URL("../dist/", import.meta.url);
await mkdir(output, { recursive: true });
for (const file of ["index.html", "app.js", "styles.css"])
  await copyFile(new URL("../" + file, import.meta.url), new URL(file, output));
for (const directory of ["data", "core", "ui", "assets"])
  await cp(
    new URL("../" + directory + "/", import.meta.url),
    new URL(directory + "/", output),
    { recursive: true },
  );
console.log(
  "Build estático generado en dist/, con lecciones y páginas de examen.",
);
