import React from 'react';
import TopTabNavigation from '../../Navigation/TopTabNavigation';

const ProfileNew = ({route}) => {
  return (
    <>
      <TopTabNavigation notificationData={route?.params} />
    </>
  );
};

export default ProfileNew;