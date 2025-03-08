import { useState, useRef, useCallback } from 'react';
import { Transition } from 'react-transition-group';

import { useAppSelector } from '../../hooks/useRedux';
import useClickOutsideHandler from '../../hooks/useClickOutsideHandler';
import useSignOut from '../../hooks/useSignOut';

import { fadingStyle } from '../../utilities/transitionUtility';

import './Profile.scss';

import SignOutIcon from '../../assets/signOut.svg?react';
import XmarkIcon from '../../assets/xmark.svg?react';

function Profile() {
  const signOut = useSignOut();

  const pictureUrl = useAppSelector((state) => state.user.pictureUrl);
  const name = useAppSelector((state) => state.user.name);
  const email = useAppSelector((state) => state.user.email);

  const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false);

  const profilePictureRef = useRef<HTMLImageElement>(null);
  const profileDetailsRef = useRef<HTMLDivElement>(null);

  const closeProfileDetails = useCallback(() => {
    setIsProfileDetailsOpen(false);
  }, []);

  useClickOutsideHandler(isProfileDetailsOpen, closeProfileDetails, [profilePictureRef, profileDetailsRef]);

  function toggleProfileDetailsHandler() {
    setIsProfileDetailsOpen((prev) => !prev);
  }

  function signoutHandler() {
    signOut();
    setIsProfileDetailsOpen(false);
  }

  return (
    <div className="profile">
      <img
        src={pictureUrl}
        alt="Profile"
        className={`profile__picture ${isProfileDetailsOpen ? 'active' : ''}`}
        ref={profilePictureRef}
        onClick={toggleProfileDetailsHandler}
      />

      <Transition nodeRef={profileDetailsRef} in={isProfileDetailsOpen} timeout={150} mountOnEnter unmountOnExit>
        {(state) => (
          <div className="profile__details" ref={profileDetailsRef} style={fadingStyle(state)}>
            <div className="profile__details--personal-info">
              <div className="left">
                <img src={pictureUrl} alt="Profile" className="picture" />
              </div>

              <div className="right">
                <p className="name">{name}</p>
                <p className="email">{email}</p>
              </div>

              <button className="close-btn" onClick={closeProfileDetails}>
                <XmarkIcon></XmarkIcon>
              </button>
            </div>

            <button className="profile__sign-out-btn" onClick={signoutHandler}>
              <SignOutIcon></SignOutIcon> Sign out
            </button>
          </div>
        )}
      </Transition>
    </div>
  );
}

export default Profile;
