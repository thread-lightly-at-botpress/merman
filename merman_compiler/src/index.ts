import { createApiApp } from "./api.js";

const port = Number(process.env.PORT ?? 8080);
const app = createApiApp();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`merman compiler API listening on :${port}`);
});
