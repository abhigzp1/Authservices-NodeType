import { startServer } from "./app";
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 4000;

startServer().then(app => {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/graphql`));
});
