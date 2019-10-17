<template>
    <div class="__nuxt-error-page">
        <div class="error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#DBE1EC" viewBox="0 0 48 48">
                <path d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" /></svg>
            <div class="title">
                {{ message }}
            </div>
            <p v-if="statusCode === 404" class="description">
                <a class="error-link" @click.stop="refresh">刷 新</a>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Error',
    props: {
        error: {
            type: Object,
            default: function () {
                return {};
            }
        }
    },
    head() {
        return {
            title: this.message,
            meta: [
                {
                    name: 'viewport',
                    content:
                        'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
                }
            ]
        };
    },
    computed: {
        statusCode() {
            return (this.error && this.error.statusCode) || 500;
        },
        message() {
            return this.error.message;
        }
    },
    methods: {
        refresh() {
            location.reload();
        }
    }
};
</script>

<style scoped>
.__nuxt-error-page {
    padding: 1rem;
    background: #f7f8fb;
    color: #47494e;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: sans-serif;
    font-weight: 100 !important;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.__nuxt-error-page .error {
    max-width: 4.5rem;
}
.__nuxt-error-page .title {
    font-size: 0.3rem;
    margin-top: 0.15rem;
    color: #47494e;
    margin-bottom: 0.08rem;
}
.__nuxt-error-page .description {
    color: #7f828b;
    margin-bottom: 0.1rem;
}
.__nuxt-error-page a {
    color: #7f828b !important;
    text-decoration: none;
    display: block;
    font-size: 0.25rem;
}
.__nuxt-error-page .logo {
    position: fixed;
    left: 0.12rem;
    bottom: 0.12rem;
}
.error-link {
    font-size: 0.3rem;
}
svg {
    width: 1.8rem;
    height: 1.8rem;
}
</style>
