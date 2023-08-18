import React from 'react';

const UserBox = ({user, onClickFn}) => {
  return (
    <div className='user-box' onClick={onClickFn}>
      <img src={user.pic} className="ub-pic" alt={user.name}></img>
      <div>
        <p className='ub-name'>{user.name}</p>
        <p className='ub-email'>{user.email}</p>
      </div>
    </div>
  )
}

export default UserBox;