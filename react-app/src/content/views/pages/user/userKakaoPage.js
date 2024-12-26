import React from 'react';
import LocalStorageManager from "content/views/pages/user/localStorageManager";

const KakaoUserPage = () => {
    return (
        <div>
            <h1>카카오 사용자 설정</h1>
            <LocalStorageManager/>
        </div>
    );
};

export default KakaoUserPage;