import "dotenv/config";

import app from "./app";

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(" AutoSocial AI Backend");
  console.log(` Server: http://localhost:${PORT}`);
});
