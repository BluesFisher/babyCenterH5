import Raven from 'raven-js'
import Vue from 'vue'

Raven.config('https://b61abe8131f74cb09330266225caba4f@report.url.cn/sentry/203').install()

Vue.config.errorHandler = (err, vm, info) => {
    Raven.captureException(err)
}
