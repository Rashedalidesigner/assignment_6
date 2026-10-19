import app from "./app";
import { config } from "./config/config";

const port = config.PORT || 3000;

const Main = ()=>{
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

Main();