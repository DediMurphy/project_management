import app from "./index.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server In running on http://localhost:${PORT}`);
});

