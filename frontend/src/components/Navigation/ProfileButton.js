// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useHistory } from "react-router-dom";
import './ProfileButton.css';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    history.push('/')
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const mySpots = (e) => {
    e.preventDefault();
    history.push('/my-spots')
    closeMenu();
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="user-icon-div">
        <button onClick={openMenu} className='user-icon'>
            <div className="user-bars-div">
                <i className="fa-solid fa-bars" id="solid-bars" />
                <i className="fas fa-user-circle" />
            </div>
        </button>
        <div className={ulClassName} ref={ulRef}>
            {user ? (
                <div className="user-actions"> 
                    <p>Hello, {user.username}</p>
                    <p id="user-email">{user.email}</p>
                    <button onClick={mySpots} className='airbnbz-button' id="spots-button">Manage My Spots</button>
                    <button onClick={logout}  className='airbnbz-button' id="logout-button">Log Out</button>
                </div>
            ) : (
                <div className="dropdown-menu">
                    <div className="login-signup">
                        <div id="signup-modal">
                            <OpenModalMenuItem
                            itemText='Sign Up'
                            onItemClick={closeMenu}
                            modalComponent={<SignupFormModal />}
                        />
                    </div>
                        <div id='login-modal'>
                            <OpenModalMenuItem
                            itemText='Log In'
                            onItemClick={closeMenu}
                            modalComponent={<LoginFormModal />}
                        />
                    </div>
                </div>
             </div>
             )}
        </div>
    </div>
  );
}

export default ProfileButton;
                   

                   