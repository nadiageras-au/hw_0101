import {app} from './app';
import {SETTINGS} from "./settings";

app.listen(SETTINGS.PORT, () => {
    console.log('.... server starting in port ' + SETTINGS.PORT);
})