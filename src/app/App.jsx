import history from "history.js";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import "../styles/_app.scss";
import EgretTheme from "./EgretLayout/EgretTheme/EgretTheme";
import AppContext from "./appContext";

import { loadProgressBar } from "axios-progress-bar";
import { observer } from "mobx-react";
import "../styles/nprogress.css";
import EgretLayout from "./EgretLayout/EgretLayout";
import routes from "./RootRoutes";
import Auth from "./auth/Auth";
import AuthGuard from "./auth/AuthGuard";
import { Store } from "./redux/Store";

loadProgressBar();
const App = () => {
  return (
    <AppContext.Provider value={{ routes }}>
      <Provider store={Store}>
        <EgretTheme>
          <Auth>
            <Router history={history}>
              <AuthGuard>
                <EgretLayout />
              </AuthGuard>
            </Router>
          </Auth>
        </EgretTheme>
      </Provider>
    </AppContext.Provider>
  );
};

export default observer(App);
