import React from "react";
import { useEffect } from "react";
import "./App.css";
import "monday-ui-react-core/tokens"
import { monday } from "./services/monday"
import { useContextStore } from "./store/useContextStore";
import CreateOrderComponent from "./components/CreateOrderComponent"

const App = () => {
  const setContext = useContextStore((state) => state.setContext)

  useEffect(() => {
    monday.execute("valueCreatedForUser")

    monday.listen("context", (res) => {
      setContext(res.data)
    })
  }, [])

  return (
    <div className="App">
      <CreateOrderComponent />
    </div>
  );
};

export default App;
