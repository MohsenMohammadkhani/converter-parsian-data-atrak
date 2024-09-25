import Convertor from "./Convertor";
import { Route, Routes } from "react-router-dom";
import routes from "./routes";

function App() {
  return (
    <div className="App">
      <Routes>
        {routes.map((route, item) => (
          <Route
            key={item}
            element={route.component}
            path={route.path}
            exact={route.exact}
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
