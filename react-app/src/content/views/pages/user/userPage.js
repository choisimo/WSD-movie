import React from 'react';
import LocalStorageManager from "content/views/pages/user/localStorageManager";

const UserPage = () => {
    return (
        <div>
            <h1>사용자 설정</h1>
            <LocalStorageManager/>
        </div>
    );
};

export default UserPage;