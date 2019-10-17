import { mount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('Logo', () => {
    test('is a Vue instance', () => {
        const wrapper = mount(HelloWorld);
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
});
