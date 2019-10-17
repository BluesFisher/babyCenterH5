export default ({ $axios, redirect }) => {
    $axios.onRequest((config: any) => {
        config.withCredentials = true;
        return config;
    });
    $axios.onResponse((response: any) => {
        const status = response.status;
        if (status === 200) {
            const result = response.data;
            console.log(result);
            if (result.retcode === 304 && result.url) {
                location.href = result.url;
            }
        }
    });
    $axios.onError((error: any) => {
        const code = parseInt(error.response && error.response.status);
        if (code === 400) {
            redirect('/400');
        }
    });
};
