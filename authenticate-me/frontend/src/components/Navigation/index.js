// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalMenuItem from './OpenModalMenuItem';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='nav'>
        <div className='nav-inner'>
            <div className='left-nav'>
                <NavLink exact to='/' className='logo'>AIRBNBZ</NavLink>
            </div>
            {isLoaded && (
                <div className='right-nav'>
                    {sessionUser ? (
                        <span className='create-spot'>
                            <NavLink exact to='/spots/new' className='create-new-spot nav-text'>
                                Create a New Spot
                            </NavLink>
                        </span>
                    ) : (
                        <span className='create-spot'>
                            <div>
                                <OpenModalMenuItem
                                    itemText='Create A New Spot'
                                    modalComponent={<SignupFormModal />}
                                />
                            </div>
                        </span>
                    )}
                    <div className='profile-button'>
                        <ProfileButton user={sessionUser} />
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}

export default Navigation;