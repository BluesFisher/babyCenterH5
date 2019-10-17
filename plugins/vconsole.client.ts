import vconsole from 'vconsole';

export default ({ query, app }) => {
    // !!query.vconsole && new vconsole()
    const $cookies = app.$cookies;
    if (!$cookies) {
        return !!query.vconsole && new vconsole();
    }
    if (query.vconsole == 0) {
        return $cookies.set('isShowVconsole', '');
    }
    const isShowVconsole = $cookies.cookies.isShowVconsole || '';
    if (isShowVconsole) {
        return new vconsole();
    } else if (query.vconsole == 1) {
        $cookies.set('isShowVconsole', 1, {
            expires: 60 * 5
        });
        return new vconsole();
    }
};
