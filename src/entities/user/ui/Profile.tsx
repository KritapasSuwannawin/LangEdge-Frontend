import { useState, useRef, useCallback } from 'react';
import { Transition } from 'react-transition-group';

import SignOutIcon from '@/assets/signOut.svg?react';
import XmarkIcon from '@/assets/xmark.svg?react';
import { useClickOutsideHandler } from '@/shared/lib';
import { useAppSelector } from '@/app/store/hooks';
import { fadingStyle } from '@/shared/lib';
import { selectUserPictureUrl, selectUserName, selectUserEmail } from '../model/userSlice';

import './Profile.scss';

interface ProfileProps {
  onSignOut: () => void;
}

function Profile({ onSignOut }: ProfileProps) {
  const pictureUrl = useAppSelector(selectUserPictureUrl);
  const name = useAppSelector(selectUserName);
  const email = useAppSelector(selectUserEmail);

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
    onSignOut();
    setIsProfileDetailsOpen(false);
  }

  return (
    <div className="profile">
      <img
        src={pictureUrl}
        alt="Profile"
        className={`profile__picture ${isProfileDetailsOpen ? 'active' : ''}`}
        data-testid="nav-profile-toggle"
        ref={profilePictureRef}
        onClick={toggleProfileDetailsHandler}
      />

      <Transition nodeRef={profileDetailsRef} in={isProfileDetailsOpen} timeout={150} mountOnEnter unmountOnExit>
        {(state) => (
          <div className="profile__details" data-testid="nav-profile-details" ref={profileDetailsRef} style={fadingStyle(state)}>
            <div className="profile__details--personal-info">
              <div className="left">
                <img src={pictureUrl} alt="Profile" className="picture" />
              </div>

              <div className="right">
                <p className="name">{name}</p>
                <p className="email">{email}</p>
              </div>

              <button type="button" className="close-btn" onClick={closeProfileDetails}>
                <XmarkIcon></XmarkIcon>
              </button>
            </div>

            <button type="button" className="profile__sign-out-btn" data-testid="nav-sign-out-button" onClick={signoutHandler}>
              <SignOutIcon></SignOutIcon> Sign out
            </button>
          </div>
        )}
      </Transition>
    </div>
  );
}

export default Profile;
