// db.js
import { postgres } from "../../deps.ts";

const sql = postgres({
  // will use psql environment variables
});

export default sql;
