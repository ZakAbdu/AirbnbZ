// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

import AllSpots from "./components/Spots/AllSpots";
import Spot from "./components/Spots/Spot";
import UserSpots from "./components/Spots/UserSpots";
import CreateSpotForm from "./components/Spots/CreateSpot";
import EditSpotForm from "./components/Spots/EditSpot";

import "./index.css";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <AllSpots />
          </Route>
          <Route exact path='/spots/new'>
            <CreateSpotForm />
          </Route>
          <Route exact path='/my-spots'>
            <UserSpots />
          </Route>
          <Route exact path='/spots/:spotId/edit'>
            <EditSpotForm />
          </Route>
          <Route exact path='/spots/:spotId'>
            <Spot />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;