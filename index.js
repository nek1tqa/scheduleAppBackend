import appConfig from "./utils/appConfig.js";
import {createServer} from "./server.js";

const app = createServer();
app.listen(appConfig.port, () => console.log("SERVER START"));
